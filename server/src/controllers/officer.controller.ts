import { Request, Response } from "express";
import User from "../models/user";
import OfficerTerm from "../models/officerTerm";
import { uploadToCloudinary } from "../utils/cloudinary";
import { getCurrentAcademicYear } from "../utils/academic-year";
import { formatOfficerName } from "../utils/format-name";
import { escapeRegExp } from "../utils/regex";

// Mirrors the client's splitCouncilPosition (client/src/app/officers/[slug]/page.tsx)
// so a live assignment archives under the same {position, role} shape the
// Officers Archive display already expects (e.g. "SSG Representative" ->
// position "SSG", role "Representative").
const ordinalYear = (n: number) => {
  const suffix = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  return `${n}${suffix} Year`;
};

const splitCouncilPosition = (
  position: string,
  yearLevel?: number | null
): { position: string; role?: string } => {
  if (position === "Batch Representative" && yearLevel) {
    return { position: ordinalYear(yearLevel), role: "Batch Representative" };
  }
  if (position === "SSG Representative") {
    return { position: "SSG", role: "Representative" };
  }
  return { position };
};

// Matches users who currently hold *any* officer assignment — either the new
// independent council/committee fields, or (for records created before those
// fields existed) the legacy single-slot `role`.
const ANY_OFFICER_QUERY = {
  $or: [
    { councilPosition: { $nin: [null, ""] } },
    { committeeTitle: { $nin: [null, ""] } },
    { role: { $in: ["council-officer", "committee-officer"] } },
  ],
};

export const getOfficers = async (req: Request, res: Response) => {
  try {
    const officers = await User.find(ANY_OFFICER_QUERY).select(
      "firstName lastName middleName role position department profilePicture email studentNumber yearLevel councilPosition councilYearLevel committeeDepartment committeeTitle"
    );

    res.status(200).json({ success: true, data: officers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public, read-only roster for the About/Home pages (no sensitive fields)
export const getPublicOfficers = async (req: Request, res: Response) => {
  try {
    const { department } = req.query;

    // "executive" -> has a council position, "committee" -> has a committee
    // title, a specific committee name -> members of that committee.
    // Falls back to the legacy `role`/`department` fields for records
    // predating the councilPosition/committeeDepartment columns.
    let query: Record<string, unknown> = ANY_OFFICER_QUERY;
    if (department === "executive") {
      query = {
        $or: [
          { councilPosition: { $nin: [null, ""] } },
          { role: "council-officer" },
        ],
      };
    } else if (department === "committee") {
      query = {
        $or: [
          { committeeTitle: { $nin: [null, ""] } },
          { role: "committee-officer" },
        ],
      };
    } else if (department) {
      // A specific committee name (e.g. "Committee on Internal Affairs")
      query = {
        $or: [{ committeeDepartment: department }, { department }],
      };
    }

    const officers = await User.find(query).select(
      "firstName lastName middleName position department profilePicture role councilPosition councilYearLevel committeeDepartment committeeTitle"
    );

    res.status(200).json({ success: true, data: officers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOfficer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      assignmentType, // "council" | "committee"
      position,
      department,
      yearLevel,
      remove,
      termYear,
    } = req.body;
    let { profilePicture } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Handle Base64 Image Upload
    if (profilePicture && profilePicture.startsWith("data:image")) {
      try {
        const matches = profilePicture.match(
          /^data:([A-Za-z-+/]+);base64,(.+)$/
        );
        if (matches && matches.length === 3) {
          const buffer = Buffer.from(matches[2], "base64");
          const uploadResult = await uploadToCloudinary(buffer, "officers");
          profilePicture = uploadResult.secure_url;
        }
      } catch {
      }
    }

    const isRemoving = remove === true || remove === "true";
    const updateData: any = {};
    if (profilePicture) updateData.profilePicture = profilePicture;

    if (assignmentType === "council") {
      updateData.councilPosition = isRemoving ? null : position;
      updateData.councilYearLevel = isRemoving ? null : yearLevel ?? null;
      // legacy fields, kept in sync for anything still reading them directly
      updateData.position = isRemoving ? null : position;
      updateData.yearLevel = isRemoving ? null : yearLevel ?? null;
    } else if (assignmentType === "committee") {
      updateData.committeeDepartment = isRemoving ? null : department;
      updateData.committeeTitle = isRemoving ? null : position;
      updateData.department = isRemoving ? null : department;
    } else {
      // Legacy call shape (no assignmentType) — behave as before for compatibility.
      updateData.role = req.body.role;
      updateData.position = position;
      updateData.department = department;
      updateData.yearLevel = yearLevel;
    }

    // Recompute the single `role` enum from the resulting assignments, since
    // council-officer and committee-officer grant identical permissions and
    // we must not clobber one assignment's role when only touching the other.
    if (
      assignmentType &&
      ["student", "council-officer", "committee-officer"].includes(user.role)
    ) {
      const willHaveCouncil =
        assignmentType === "council"
          ? !isRemoving
          : !!user.councilPosition;
      const willHaveCommittee =
        assignmentType === "committee"
          ? !isRemoving
          : !!user.committeeTitle;

      updateData.role = willHaveCouncil
        ? "council-officer"
        : willHaveCommittee
          ? "committee-officer"
          : "student";
    }

    const updated = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // Auto-archive this assignment under its academic year, so it stays on
    // record in the Officers Archive even after the officer is later
    // removed/replaced. Only for the new council/committee flow, and never
    // on removal — removing a live seat must not erase history.
    if (assignmentType && !isRemoving && position) {
      try {
        const archiveTermYear =
          (termYear && String(termYear).trim()) || getCurrentAcademicYear();
        const departmentType =
          assignmentType === "council" ? "executive" : "committee";
        const committeeName =
          assignmentType === "committee" ? department || null : null;
        const { position: archivePosition, role: archiveRole } =
          assignmentType === "council"
            ? splitCouncilPosition(position, yearLevel)
            : { position, role: undefined };

        await OfficerTerm.findOneAndUpdate(
          {
            sourceUserId: user._id,
            departmentType,
            termYear: archiveTermYear,
            committeeName,
          },
          {
            $set: {
              name: formatOfficerName(
                user.firstName,
                user.lastName,
                user.middleName
              ),
              position: archivePosition,
              role: archiveRole || null,
              departmentType,
              committeeName,
              termYear: archiveTermYear,
              image: updated?.profilePicture || null,
              isActive: true,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch {
      }
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchNonOfficers = async (req: Request, res: Response) => {
  try {
    const { query, type } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query parameter is required" });
    }

    const searchText = escapeRegExp(String(query).slice(0, 100));

    // Only exclude students who already hold *this* specific assignment type,
    // so a council officer can still be found and assigned a committee role
    // (and vice versa).
    const notAlreadyAssigned =
      type === "committee"
        ? {
            $or: [
              { committeeTitle: null },
              { committeeTitle: "" },
              { committeeTitle: { $exists: false } },
            ],
          }
        : {
            $or: [
              { councilPosition: null },
              { councilPosition: "" },
              { councilPosition: { $exists: false } },
            ],
          };

    const users = await User.find({
      $and: [
        notAlreadyAssigned,
        {
          $or: [
            { firstName: { $regex: searchText, $options: "i" } },
            { lastName: { $regex: searchText, $options: "i" } },
            { studentNumber: { $regex: searchText, $options: "i" } },
          ],
        },
      ],
    })
      .select(
        "firstName lastName middleName studentNumber profilePicture email role councilPosition committeeTitle"
      )
      .limit(10);

    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

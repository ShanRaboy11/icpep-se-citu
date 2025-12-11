import { Request, Response } from "express";
import User from "../models/user";
import { uploadToCloudinary } from "../utils/cloudinary";

export const getOfficers = async (req: Request, res: Response) => {
  try {
    const officers = await User.find({
      role: { $in: ["council-officer", "committee-officer"] },
    }).select(
      "firstName lastName middleName role position department profilePicture email studentNumber yearLevel"
    );

    res.status(200).json({ success: true, data: officers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOfficer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let { role, position, department, yearLevel, profilePicture } = req.body;

    // Handle Base64 Image Upload
    if (profilePicture && profilePicture.startsWith("data:image")) {
      try {
        // Extract base64 data
        const matches = profilePicture.match(
          /^data:([A-Za-z-+\/]+);base64,(.+)$/
        );

        if (matches && matches.length === 3) {
          const buffer = Buffer.from(matches[2], "base64");
          const uploadResult = await uploadToCloudinary(buffer, "officers");
          profilePicture = uploadResult.secure_url;
        }
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        // Continue without updating image if upload fails, or handle error
      }
    }

    const updateData: any = { role, position, department, yearLevel };
    if (profilePicture) {
      updateData.profilePicture = profilePicture;
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchNonOfficers = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query parameter is required" });
    }

    const users = await User.find({
      role: { $nin: ["council-officer", "committee-officer"] },
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { studentNumber: { $regex: query, $options: "i" } },
      ],
    })
      .select(
        "firstName lastName middleName studentNumber profilePicture email role"
      )
      .limit(10);

    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

"use client";

import Button from "../../components/ui/button";
import { DetailCardSkeleton } from "../../components/feedback/skeleton-cards";
import { Skeleton, useDelayedFlag } from "../../components/feedback/skeleton";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AnnouncementDetails from "../../components/announcements/details";
import DetailsSidebar from "../../components/announcements/info";
import MeetingAttendanceCard from "../../components/announcements/attendance-card";
import MoreAnnouncements from "../../components/announcements/more-announcements";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import Grid from "../../components/layout/grid";
import { ChevronLeft } from "lucide-react";
import AnnouncementMedia from "../../components/announcements/media";
import BackButton from "../../components/ui/back-button";
import announcementService from "../../services/announcement";
import { Announcement as UtilAnnouncement } from "../../utils/announcements/announcements";

interface RawAnnouncement {
  _id: string;
  id?: string;
  title: string;
  description: string;
  content?: string;
  type: string;
  imageUrl?: string | null;
  galleryImages?: string[];
  galleryImageUrls?: string[];
  publishDate?: string;
  date?: string;
  author?: {
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  views?: number;
  isPublished?: boolean;
  time?: string;
  location?: string;
  organizer?: string;
  contact?: string;
  attendees?: string;
  attendance?: { name: string; position: string }[];
  agenda?: string[];
  awardees?: Array<{
    name: string;
    program?: string;
    year: string;
    award: string;
  }>;
  priority?: string;
  expiryDate?: string;
}

export default function AnnouncementDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [announcement, setAnnouncement] = useState<RawAnnouncement | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const showSkeleton = useDelayedFlag(loading);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await announcementService.getAnnouncementById(id);

        if (response.success && response.data) {
          setAnnouncement(response.data as RawAnnouncement);
        } else {
          setError("Announcement not found");
        }
      } catch {
        setError("Failed to load announcement. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main
          data-skeleton-hidden={showSkeleton ? undefined : ""}
          className="grow w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 pt-38 pb-12"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-64 w-full rounded-3xl sm:h-96" />
              <Skeleton className="h-40 w-full rounded-3xl" />
              <DetailCardSkeleton lines={5} />
            </div>

            <div className="lg:col-span-1">
              <DetailCardSkeleton lines={4} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="flex grow flex-col items-center justify-center text-center px-4 pt-38 pb-12">
          <h1 className="font-rubik text-4xl font-bold text-primary3 mb-4">
            {error || "Announcement Not Found"}
          </h1>
          <p className="font-raleway max-w-md text-gray-600 mb-8">
            {error
              ? "There was an error loading this announcement."
              : "Sorry, the announcement you are looking for does not exist."}
          </p>
          <Button variant="hero" onClick={() => router.push("/announcements")}>
            <span className="inline-flex items-center gap-2">
              <ChevronLeft className="h-5 w-5" />
              {"Back to Announcements"}
            </span>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const title = announcement.title;
  const imageUrl = announcement.imageUrl || "/placeholders/placeholder.svg";
  const galleryImageUrls: string[] = announcement.galleryImages ?? [];
  const isMeeting = announcement.type.toLowerCase() === "meeting";

  let utilAnnouncement: UtilAnnouncement | undefined = undefined;
  if (announcement) {
    const typeKey = (announcement.type || "").toLowerCase();
    const mappedType: UtilAnnouncement["type"] =
      typeKey === "meeting"
        ? "Meeting"
        : typeKey === "achievement"
          ? "Achievement"
          : "News";

    const organizerStr =
      typeof announcement.organizer === "string"
        ? announcement.organizer
        : announcement.organizer && typeof announcement.organizer === "object"
          ? String(
              (announcement.organizer as Record<string, unknown>).name ?? "",
            )
          : "";

    utilAnnouncement = {
      id: announcement._id || announcement.id || "",
      title: announcement.title,
      description: announcement.description,
      date:
        announcement.publishDate ||
        announcement.date ||
        new Date().toISOString(),
      type: mappedType,
      imageUrl: imageUrl,
      galleryImageUrls: Array.isArray(announcement.galleryImages)
        ? announcement.galleryImages
        : [],
      time: announcement.time,
      location: announcement.location,
      organizer: organizerStr,
      attendees: announcement.attendees,
      attendance: announcement.attendance,
      agenda: announcement.agenda,
      awardees: announcement.awardees,
    };
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-pageblue">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />

          <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-6 pt-38 pb-16">
            <div className="mb-8 flex justify-start">
              <BackButton onClick={handleBack} title="Back to Announcements" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <AnnouncementMedia
                  title={title}
                  imageUrl={imageUrl}
                  galleryImageUrls={galleryImageUrls}
                />
                <AnnouncementDetails announcement={announcement} />
              </div>

              <div className="h-fit space-y-6 lg:sticky lg:top-28 lg:col-span-1">
                <DetailsSidebar announcement={utilAnnouncement} />

                {isMeeting && (
                  <MeetingAttendanceCard
                    attendance={announcement.attendance}
                    attendanceLink={announcement.attendees}
                  />
                )}

                <MoreAnnouncements currentId={announcement._id || announcement.id || ""} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>

    </div>
  );
}

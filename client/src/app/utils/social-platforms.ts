import type { ComponentType } from "react";
import { IconType } from "react-icons";
import { SiGmail } from "react-icons/si";
import { Mail } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaXTwitter,
  FaThreads,
  FaLinkedinIn,
  FaDiscord,
  FaGithub,
  FaTelegram,
} from "react-icons/fa6";

export interface SocialPlatform {
  id: string;
  label: string;
  Icon: IconType;
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: "facebook", label: "Facebook", Icon: FaFacebookF },
  { id: "instagram", label: "Instagram", Icon: FaInstagram },
  { id: "tiktok", label: "TikTok", Icon: FaTiktok },
  { id: "youtube", label: "YouTube", Icon: FaYoutube },
  { id: "x", label: "X", Icon: FaXTwitter },
  { id: "threads", label: "Threads", Icon: FaThreads },
  { id: "linkedin", label: "LinkedIn", Icon: FaLinkedinIn },
  { id: "discord", label: "Discord", Icon: FaDiscord },
  { id: "github", label: "GitHub", Icon: FaGithub },
  { id: "telegram", label: "Telegram", Icon: FaTelegram },
];

export const platformMeta = (id: string) => SOCIAL_PLATFORMS.find((platform) => platform.id === id);

interface EmailMeta {
  label: string;
  Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

const GMAIL_DOMAINS = ["gmail.com", "googlemail.com"];

export const emailMeta = (email: string): EmailMeta =>
  GMAIL_DOMAINS.includes(email.split("@")[1]?.toLowerCase() ?? "")
    ? { label: "Gmail", Icon: SiGmail }
    : { label: "Email", Icon: Mail };

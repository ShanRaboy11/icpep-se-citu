import { Box, Lightbulb, Rocket, Ribbon } from "lucide-react";
import { SectionType } from "./types";

export const sections: SectionType[] = [
  {
    id: "org",
    tabLabel: "ICpEP SE CIT-U",
    icon: <Box size={22} />,
    title: "Engineered for Impact",
    content:
      "The Institute of Computer Engineers of the Philippines (ICpEP) Student Edition at Cebu Institute of Technology-University is a dynamic student body dedicated to the holistic development of future computer engineers.",
    imageUrls: ["/gle.png", "/meeting.png", "/whyicpep.png"],
  },
  {
    id: "vision",
    tabLabel: "Vision",
    icon: <Lightbulb size={22} />,
    title: "Leading Innovation Forward",
    content:
      "To be a community-driven center of excellence in computer engineering, fostering innovators who lead technological advancement and are recognized for their technical prowess and ethical leadership.",
    imageUrls: "/gle.png",
  },
  {
    id: "mission",
    tabLabel: "Mission",
    icon: <Rocket size={22} />,
    title: "Empowering Change-Makers",
    content:
      "To provide holistic development for students through academic support, skills training, and community engagement, preparing them to be globally competent professionals who can solve complex problems.",
    imageUrls: "/gle.png",
  },
  {
    id: "values",
    tabLabel: "Core Values",
    icon: <Ribbon size={22} />,
    title: "Values That Inspire",
    content:
      "We uphold a steadfast commitment and a passion for technology, collaborating to achieve excellence and serve our community, turning innovative ideas into impactful realities.",
    imageUrls: "/gle.png",
  },
];

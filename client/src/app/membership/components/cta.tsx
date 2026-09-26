"use client";

import { useRef, type MouseEvent, type FC } from "react";
import Button from "../../components/button";

interface InteractiveCtaProps {
  isOpen?: boolean;
  registrationUrl?: string;
}

const InteractiveCta: FC<InteractiveCtaProps> = ({
  isOpen = true,
  registrationUrl = "",
}) => {
  const textRef = useRef<HTMLHeadingElement | null>(null);

  const announcementsUrl = "/announcements";

  const handleMouseMove = (e: MouseEvent<HTMLHeadingElement>) => {
    const textElement = textRef.current;
    if (!textElement) return;

    const { left, top } = textElement.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    textElement.style.setProperty("--mouse-x", `${x}px`);
    textElement.style.setProperty("--mouse-y", `${y}px`);
    textElement.style.setProperty("--opacity", "1");
  };

  const handleMouseLeave = () => {
    const textElement = textRef.current;
    if (textElement) {
      textElement.style.setProperty("--opacity", "0");
    }
  };

  const titleText = isOpen
    ? "Engineer Your Future!"
    : "Stay Tuned, COMPanions!";

  const paragraphText = isOpen
    ? "Ready to elevate your journey? Choose your plan and start enjoying the benefits today. The registration process is quick and easy."
    : "We’ve concluded our membership drive. Thank you for your interest! Please check announcements on the next opening.";

  const buttonText = isOpen ? "Register Now" : "See What’s New";

  return (
    <div className="relative text-center max-w-full mx-auto mt-40 py-16">
      <h2
        ref={textRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="font-rubik text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold text-primary3 relative cursor-default"
        style={
          {
            "--mouse-x": "50%",
            "--mouse-y": "50%",
            "--opacity": "0",
          } as React.CSSProperties
        }
      >
        <span
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: "var(--opacity)",
            background:
              "radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), #003599 0%, #04a6ef 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {titleText}
        </span>
        {titleText}
      </h2>

      <p className="font-raleway text-gray-500 mt-8 mb-10 text-lg max-w-3xl mx-auto px-4">
        {paragraphText}
      </p>

      <Button
        variant="hero"
        onClick={() => {
          if (isOpen && registrationUrl) {
            window.open(registrationUrl, "_blank");
          } else {
            window.location.href = announcementsUrl;
          }
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default InteractiveCta;

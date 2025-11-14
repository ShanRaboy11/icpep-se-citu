// components/event-banner.tsx
"use client";

import { useState } from "react";

interface Props {
  imageUrl: string;
  title: string;
}

export default function EventBanner({ imageUrl, title }: Props) {
  const [imgSrc, setImgSrc] = useState(imageUrl || "/placeholder.svg");
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(56,189,248,0.3)] bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 w-full h-full" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={`Banner for ${title}`}
        onError={() => {
          setImgSrc("/placeholder.svg");
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
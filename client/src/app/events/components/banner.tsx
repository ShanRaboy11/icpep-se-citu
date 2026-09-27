"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  imageUrl: string;
  title: string;
}

export default function EventBanner({ imageUrl, title }: Props) {
  const [imgSrc, setImgSrc] = useState(imageUrl || "/placeholders/placeholder.svg");
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(56,189,248,0.3)] bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 w-full h-full" />
        </div>
      )}
      <Image
        src={imgSrc}
        alt={`Banner for ${title}`}
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        priority
        onError={() => {
          setImgSrc("/placeholders/placeholder.svg");
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
        unoptimized={imgSrc.endsWith(".svg")}
        className="object-cover"
      />
    </div>
  );
}
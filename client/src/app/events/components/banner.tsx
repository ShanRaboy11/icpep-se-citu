"use client";

import { Skeleton } from "@/app/components/skeleton";
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
    <div className="relative aspect-square w-full rounded-3xl overflow-hidden ring-4 ring-white shadow-lg bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-full w-full rounded-none" />
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
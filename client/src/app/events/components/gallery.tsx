// components/event-gallery.tsx
"use client";

import { useState } from "react";

interface Props {
  imageUrls: string[];
}

export default function EventGallery({ imageUrls }: Props) {
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  if (!imageUrls || imageUrls.length === 0) return null;

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const validImages = imageUrls.filter((_, index) => !imageErrors[index]);

  if (validImages.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
      <h2 className="font-rubik text-xl sm:text-2xl font-bold text-primary3 mb-4 pb-2 border-b border-gray-100">
        Gallery
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {imageUrls.slice(0, 2).map((photo, index) => (
          <div
            key={index}
            className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gray-100"
          >
            {!imageErrors[index] ? (
              <img
                src={photo}
                alt={`Event photo ${index + 1}`}
                onError={() => handleImageError(index)}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        ))}

        {imageUrls.length === 3 && (
          <div
            key={2}
            className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gray-100"
          >
            {!imageErrors[2] ? (
              <img
                src={imageUrls[2]}
                alt={`Event photo 3`}
                onError={() => handleImageError(2)}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        )}

        {imageUrls.length > 3 && (
          <div className="group aspect-square cursor-pointer overflow-hidden relative rounded-xl shadow-sm bg-gray-100">
            {!imageErrors[2] ? (
              <>
                <img
                  src={imageUrls[2]}
                  alt="More photos"
                  onError={() => handleImageError(2)}
                  className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 group-hover:bg-black/40">
                  <span className="font-rubik text-xl sm:text-2xl font-bold text-white">
                    +{validImages.length - 2}
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="font-rubik text-xl sm:text-2xl font-bold text-gray-600">
                  +{validImages.length - 2}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
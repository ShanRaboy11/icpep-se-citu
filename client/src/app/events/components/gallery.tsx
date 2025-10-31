interface Props {
  imageUrls: string[];
}

export default function EventGallery({ imageUrls }: Props) {
  if (!imageUrls || imageUrls.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
      <h2 className="font-rubik text-xl sm:text-2xl font-bold text-primary3 mb-4 pb-2 border-b border-gray-100">
        Gallery
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {imageUrls.slice(0, 2).map((photo, index) => (
          <div
            key={index}
            className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <img
              src={photo}
              alt={`Event photo ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}

        {imageUrls.length === 3 && (
          <div
            key={2}
            className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <img
              src={imageUrls[2]}
              alt={`Event photo 3`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {imageUrls.length > 3 && (
          <div className="group aspect-square cursor-pointer overflow-hidden relative rounded-xl shadow-sm">
            <img
              src={imageUrls[2]}
              alt="More photos"
              className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 group-hover:bg-black/40">
              <span className="font-rubik text-xl sm:text-2xl font-bold text-white">
                +{imageUrls.length - 2}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

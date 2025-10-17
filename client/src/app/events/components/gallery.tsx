interface Props {
  imageUrls: string[];
}

export default function EventGallery({ imageUrls }: Props) {
  if (!imageUrls || imageUrls.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
      <h2 className="font-rubik text-2xl font-bold text-primary3 mb-4 pb-2 border-b border-gray-100">
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
        {imageUrls.length > 2 && (
          <div className="aspect-square rounded-xl overflow-hidden relative shadow-sm cursor-pointer group">
            <img
              src={imageUrls[2]}
              alt="More photos"
              className="w-full h-full object-cover filter blur-sm group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
              <span className="font-rubik text-white text-2xl font-bold">
                +{imageUrls.length - 2}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

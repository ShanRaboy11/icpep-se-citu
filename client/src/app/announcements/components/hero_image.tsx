interface HeroImageProps {
  imageUrl: string;
  title: string;
}

export default function HeroImage({ imageUrl, title }: HeroImageProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-64 sm:h-96 object-cover"
      />
    </div>
  );
}
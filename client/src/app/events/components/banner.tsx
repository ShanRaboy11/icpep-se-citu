import { Event } from "../utils/event";

interface Props {
  imageUrl: string;
  title: string;
}

export default function EventBanner({ imageUrl, title }: Props) {
  return (
    <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(56,189,248,0.3)] bg-gray-100">
      <img
        src={imageUrl}
        alt={`Banner for ${title}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

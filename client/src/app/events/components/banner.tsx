import { Event } from "../data/event";

interface Props {
  imageUrl: string;
  title: string;
}

export default function EventBanner({ imageUrl, title }: Props) {
  return (
    <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
      <img
        src={imageUrl}
        alt={`Banner for ${title}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

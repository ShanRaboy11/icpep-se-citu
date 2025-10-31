import { Event } from "../utils/event";

interface Props {
  tags: string[];
}

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-buttonbg1 text-primary3 font-raleway font-semibold px-3 py-1 rounded-full text-xs sm:text-sm">
    {children}
  </span>
);

export default function EventTags({ tags }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </div>
  );
}

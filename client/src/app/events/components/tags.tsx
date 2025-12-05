// components/event-tags.tsx
interface Props {
  tags: string[];
}

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-buttonbg1 text-primary3 font-raleway font-semibold px-3 py-1 rounded-full text-xs sm:text-sm">
    {children}
  </span>
);

export default function EventTags({ tags }: Props) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </div>
  );
}
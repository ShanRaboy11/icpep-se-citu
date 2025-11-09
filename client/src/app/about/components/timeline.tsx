// app/about/components/Timeline.tsx
import Image from "next/image";
import { FC } from "react";

interface TimelineItemProps {
  year: string;
  name: string;
  position: string;
  imageUrl: string;
}

const TimelineItem: FC<TimelineItemProps> = ({
  year,
  name,
  position,
  imageUrl,
}) => (
  <div className="relative pl-8 sm:pl-32 py-6 group">
    <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:w-px before:bg-gray-300 sm:before:translate-x-[15.5rem] sm:before:translate-y-8">
      <div className="flex-shrink-0 w-[15rem] text-left sm:text-right font-rubik font-semibold text-primary1 uppercase tracking-wider mb-2 sm:mb-0">
        {year}
      </div>
      <div className="absolute left-2 sm:left-0 sm:relative sm:translate-x-[15.5rem] h-4 w-4 bg-primary1 rounded-full mt-1.5 -translate-x-1/2"></div>
      <div className="flex-1 ml-4 sm:ml-12">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm group-hover:shadow-md transition-shadow">
          <Image
            src={imageUrl}
            alt={name}
            width={64}
            height={64}
            className="rounded-full object-cover h-16 w-16"
          />
          <div>
            <h4 className="font-rubik text-lg font-bold text-primary3">
              {name}
            </h4>
            <p className="font-raleway text-gray-500">{position}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface TimelineProps {
  items: TimelineItemProps[];
}

const Timeline: FC<TimelineProps> = ({ items }) => (
  <div className="relative">
    {items.map((item) => (
      <TimelineItem key={`${item.name}-${item.year}`} {...item} />
    ))}
  </div>
);

export default Timeline;

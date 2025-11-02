// app/membership/components/membership-card.tsx
"use client";

import { Check } from "lucide-react";
import type { FC } from "react";

// Define the type for the component's props
interface MembershipCardProps {
  title: string;
  price: string;
  description: string;
  benefits: string[];
  isHighlighted?: boolean; // isHighlighted is optional
}

const MembershipCard: FC<MembershipCardProps> = ({
  title,
  price,
  description,
  benefits,
  isHighlighted = false,
}) => {
  const cardClasses = `
    flex flex-col rounded-2xl p-8 h-full border-2 relative
    ${
      isHighlighted
        ? "bg-primary1/5 border-primary1 shadow-lg"
        : "bg-white border-gray-200"
    }
    transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
  `;

  const buttonClasses = `
    mt-8 w-full rounded-lg py-3 font-rubik font-semibold text-lg
    transition-all duration-300
    ${
      isHighlighted
        ? "bg-primary1 text-white hover:bg-primary1/90 shadow-md hover:shadow-lg"
        : "bg-primary3 text-white hover:bg-primary3/90"
    }
  `;

  return (
    <div className={cardClasses}>
      {isHighlighted && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-max">
          <span className="inline-block rounded-full bg-primary1 px-4 py-1 text-sm font-semibold text-white">
            Best Value
          </span>
        </div>
      )}
      <h3 className="font-rubik text-2xl font-bold text-primary3 mb-2">
        {title}
      </h3>
      <p className="font-raleway text-gray-500 mb-6">{description}</p>

      <div className="mb-6">
        <span className="font-rubik text-5xl font-bold text-primary3">
          {price}
        </span>
        <span className="font-raleway text-gray-500">/ academic year</span>
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      <ul className="space-y-3 font-raleway text-gray-700 flex-grow">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check
              className={`h-6 w-6 flex-shrink-0 mt-0.5 ${
                isHighlighted ? "text-primary1" : "text-green-500"
              }`}
            />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <button className={buttonClasses}>Select Plan</button>
    </div>
  );
};

export default MembershipCard;

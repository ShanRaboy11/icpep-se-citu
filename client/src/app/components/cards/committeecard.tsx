'use client';
import Image from 'next/image';
import Button from '../button';

interface CommitteeCardProps {
  title: string;
  description: string[];
  image: string;
  onClick?: () => void;
}

const CommitteeCard: React.FC<CommitteeCardProps> = ({
  title,
  description,
  image,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white text-black rounded-3xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 
                 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer 
                 border border-sky-500 max-w-5xl w-full mx-auto"
    >
      {/* Image Section */}
      <div className="flex-shrink-0 self-center w-48 h-48 md:w-70 md:h-70 rounded-full overflow-hidden bg-gray-200 m-10">
        <Image
          src={image}
          alt={title}
          width={240}
          height={240}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col space-y-3 text-center md:text-left py-5">
        <h2 className="text-center font-rubik text-2xl sm:text-3xl font-bold">{title}</h2>

        <ul className="my-4 font-raleway list-disc list-inside space-y-2">
          {description.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        
          <div className='self-center sm:self-end mr-4 mt-4'>
            <Button variant="outline">Learn More</Button>
          </div>
        
      </div>
    </div>
  );
};

export default CommitteeCard;

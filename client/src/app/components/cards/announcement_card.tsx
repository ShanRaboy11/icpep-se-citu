interface AnnouncementProps {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  imageUrl: string;
  onClick?: () => void;
}

export function AnnouncementCard({ title, description, date, type, imageUrl, onClick }: AnnouncementProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'event':
        return 'bg-blue-500 text-white';
      case 'seminar':
        return 'bg-sky-500 text-white';
      case 'achievement':
        return 'bg-green-500 text-white';
      case 'workshop':
        return 'bg-purple-500 text-white';
      case 'meeting':
        return 'bg-orange-500 text-white';
      case 'award':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="bg-white rounded-[25px] shadow-lg overflow-hidden mb-6 max-w-4xl mx-auto h-80 cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="md:flex h-full">
        {/* Image Section */}
        <div className="md:w-1/3 h-64 md:h-full">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content Section */}
        <div className="md:w-2/3 p-6 flex flex-col justify-between h-full md:h-auto">
          <div>
            {/* Type Badge */}
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 rounded-[10px] text-sm font-medium ${getTypeColor(type)}`}>
                {type}
              </span>
            </div>
            
            {/* Title */}
            <h3 className="mb-3 text-[#003599]">
              {title}
            </h3>
            
            {/* Description */}
            <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3 overflow-hidden">
              {description}
            </p>
          </div>
          
          {/* Date */}
          <div className="mt-auto">
            <p className="text-[#00A7EE] font-medium">
              {formatDate(date)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
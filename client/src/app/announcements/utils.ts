export const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    event: 'bg-blue-500',
    seminar: 'bg-sky-500',
    achievement: 'bg-green-500',
    workshop: 'bg-purple-500',
    meeting: 'bg-orange-500',
    award: 'bg-yellow-500'
  };
  return colors[type.toLowerCase()] || 'bg-gray-500';
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Use a consistent format that doesn't depend on locale
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  } catch {
    return 'Invalid date';
  }
};

export const formatDuration = (duration: string): string => {
  if (!duration) return '';

  const [hours, minutes] = duration.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return '';
  
  if (hours === 0) {
    return `${minutes}min`;
  }
  
  if (minutes === 0) {
    return `${hours}hr`;
  }
  
  return `${hours}hr ${minutes}min`;
}; 
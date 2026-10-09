export const formatGrade = (grade: string): string => {
  // Handle empty or invalid input
  if (!grade || !grade.includes('_')) return grade;

  // Extract the number part after the underscore
  const gradeNumber = grade.split('_')[1];

  // Return formatted string
  return `Grade ${gradeNumber}`;
};

export const formatDate = (date: Date | string): string => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

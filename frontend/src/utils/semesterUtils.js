// Mapping between backend semester numbers and display names
export const SEMESTER_DISPLAY = {
  1: 'Winter',
  2: 'Fall'
};

// Array of semester options for dropdowns
export const SEMESTER_OPTIONS = [
  { value: 1, label: 'Winter' },
  { value: 2, label: 'Fall' }
];

// Convert backend semester number to display name
export const getSemesterDisplay = (semesterNumber) => {
  return SEMESTER_DISPLAY[semesterNumber] || `Semester ${semesterNumber}`;
}; 
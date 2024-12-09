export const calculateGradesAndPoints = (totalMarks: number) => {
  const result = {
    grade: 'NA',
    gradePoints: 0,
  };
  if (totalMarks > 0 && totalMarks < 20) {
    result.grade = 'F';
    result.gradePoints = 0.0;
  } else if (totalMarks > 19 && totalMarks < 40) {
    result.grade = 'D';
    result.gradePoints = 1.0;
  } else if (totalMarks >= 40 && totalMarks < 60) {
    result.grade = 'C';
    result.gradePoints = 2.0;
  } else if (totalMarks >= 60 && totalMarks < 80) {
    result.grade = 'B';
    result.gradePoints = 3.0;
  } else if (totalMarks >= 80 && totalMarks <= 100) {
    result.grade = 'A';
    result.gradePoints = 4.0;
  }
  return result;
};

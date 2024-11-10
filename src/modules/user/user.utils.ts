import { TAcademicSemester } from '../academicSemester/academicSemester.interface';

import StudentModel from '../student/student.model';

export const generateStudentId = async (payload: TAcademicSemester) => {
  const existingStudent = await StudentModel.findOne().sort({
    createdAt: -1,
  });

  if (existingStudent) {
    const lastStudentId = existingStudent?.id;
    const lastStudentCode = lastStudentId.substring(4, 6);
    const lastStudentYear = lastStudentId.substring(0, 4);
    const currentYear = payload.year;
    const currentCode = payload.code;

    if (lastStudentCode === currentCode && lastStudentYear === currentYear) {
      const lastFourDigits = existingStudent?.id.slice(-5);
      const incrementId = (Number(lastFourDigits) + 1)
        .toString()
        .padStart(4, '0');
      const studentId = `${payload.year}${payload.code}${incrementId}`;
      return studentId;
    }
  }

  const currentId = (0).toString().padStart(4, '0');

  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  const studentId = `${payload.year}${payload.code}${incrementId}`;

  return studentId;
};

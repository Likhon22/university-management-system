import { academicSemesterNameCodeMapper } from './academicSemester.constants';
import { TAcademicSemester } from './academicSemester.interface';
import { academicSemesterModel } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (
  semesterData: TAcademicSemester,
) => {
  if (academicSemesterNameCodeMapper[semesterData.name] !== semesterData.code) {
    throw new Error(
      `Invalid semester code for ${semesterData.name}.Valid is ${academicSemesterNameCodeMapper[semesterData.name]}`,
    );
  }

  const newSemester = academicSemesterModel.create(semesterData);
  return newSemester;
};

const getAcademicSemestersFromDB = async () => {
  const semesters = await academicSemesterModel.find();
  return semesters;
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
  const semester = await academicSemesterModel.findById(id);
  return semester;
};

const updateAcademicSemesterIntoDB = async (
  id: string,
  semesterData: TAcademicSemester,
) => {
  if (academicSemesterNameCodeMapper[semesterData.name] !== semesterData.code) {
    throw new Error(
      `Invalid semester code for ${semesterData.name}.Valid is ${academicSemesterNameCodeMapper[semesterData.name]}`,
    );
  }

  const updatedSemester = await academicSemesterModel.findByIdAndUpdate(
    {
      _id: id,
    },
    semesterData,
    {
      new: true,
    },
  );
  return updatedSemester;
};

const academicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
};

export default academicSemesterServices;

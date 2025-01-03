import QueryBuilder from '../../app/builder/QueryBuilder';
import {
  academicSemesterNameCodeMapper,
  academicSemesterSearchableFields,
} from './academicSemester.constants';
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

const getAcademicSemestersFromDB = async (query: Record<string, unknown>) => {
  const semesters = new QueryBuilder(academicSemesterModel.find(), query)
    .search(academicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesters.modelQuery;
  const meta = await semesters.countTotal();

  return { result, meta };
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

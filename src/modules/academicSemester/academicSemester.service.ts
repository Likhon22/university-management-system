import QueryBuilder from '../../app/builder/QueryBuilder';
import AppError from '../../app/error/AppError';
import {
  academicSemesterNameCodeMapper,
  academicSemesterSearchableFields,
} from './academicSemester.constants';
import { TAcademicSemester } from './academicSemester.interface';
import { academicSemesterModel } from './academicSemester.model';
import { validateMonthRange } from './academicSemester.utils';

const createAcademicSemesterIntoDB = async (
  semesterData: TAcademicSemester,
) => {
  if (academicSemesterNameCodeMapper[semesterData.name] !== semesterData.code) {
    throw new Error(
      `Invalid semester code for ${semesterData.name}.Valid is ${academicSemesterNameCodeMapper[semesterData.name]}`,
    );
  }
  // Check if a semester already exists in the given year with overlapping months.
  // It ensures no semester has a startMonth earlier or equal to the provided startMonth
  // and an endMonth later or equal to the provided endMonth.
  const findOverlappingSemesterInYear = await academicSemesterModel.findOne({
    year: semesterData.year,
    startMonth: { $lte: semesterData.startMonth },
    endMonth: { $gte: semesterData.endMonth },
  });

  if (findOverlappingSemesterInYear) {
    throw new AppError(
      400,
      'Semester already exists in this year in between the month',
    );
  }

  // find if the start month is greater than the end month

  const isStartMonthGreaterThanEndMonth = validateMonthRange(
    semesterData.startMonth,
    semesterData.endMonth,
  );

  if (isStartMonthGreaterThanEndMonth) {
    throw new AppError(400, 'Start month is greater than end month');
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

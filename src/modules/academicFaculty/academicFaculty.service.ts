import { TAcademicFaculty } from './academicFaculty.interface';
import AcademicFacultyModel from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (
  academicFaculty: TAcademicFaculty,
) => {
  const academicFacultyModel = AcademicFacultyModel.create(academicFaculty);
  return academicFacultyModel;
};

const getAcademicFacultiesFromDB = async () => {
  const academicFaculties = await AcademicFacultyModel.find();
  return academicFaculties;
};

const getSingleAcademicFacultyFromDB = async (id: string) => {
  const academicFaculty = await AcademicFacultyModel.findById(id);
  return academicFaculty;
};

const updatedAcademicFacultyInDB = async (
  id: string,
  payload: TAcademicFaculty,
) => {
  const updateAcademicFaculty = await AcademicFacultyModel.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true },
  );
  return updateAcademicFaculty;
};
const academicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAcademicFacultiesFromDB,
  getSingleAcademicFacultyFromDB,
  updatedAcademicFacultyInDB,
};

export default academicFacultyServices;

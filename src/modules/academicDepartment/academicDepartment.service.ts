import TAcademicDepartment from './academicDepartment.interface';
import AcademicDepartmentModel from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const newAcademicDepartment = AcademicDepartmentModel.create(payload);
  return newAcademicDepartment;
};

const getAcademicDepartmentsFromDB = async () => {
  const academicDepartments =
    await AcademicDepartmentModel.find().populate('academicFaculty');
  return academicDepartments;
};

const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const academicDepartment = await AcademicDepartmentModel.findById(id);
  return academicDepartment;
};

const updateAcademicDepartmentInDB = async (
  id: string,
  payload: TAcademicDepartment,
) => {
  const updateAcademicDepartment =
    await AcademicDepartmentModel.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });
  return updateAcademicDepartment;
};

const academicDepartmentService = {
  createAcademicDepartmentIntoDB,
  getAcademicDepartmentsFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentInDB,
};

export default academicDepartmentService;

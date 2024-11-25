import QueryBuilder from '../../app/builder/QueryBuilder';
import AppError from '../../app/error/AppError';
import { academicSemesterModel } from '../academicSemester/academicSemester.model';
import { registrationStatus } from './semesterRegistration.constants';

import { TSemesterRegistration } from './semesterRegistration.interface';
import { semesterRegistrationModel } from './semesterRegistration.model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;
  // check if their any upcoming or ongoing semesters
  const semesterStatus = await semesterRegistrationModel.findOne({
    $or: [
      { status: registrationStatus.UPCOMING },
      { status: registrationStatus.ONGOING },
    ],
  });
  if (semesterStatus) {
    throw new AppError(
      400,
      `There is already an ${semesterStatus.status} registered semester!`,
    );
  }
  //   check if the academic semester exists
  const isAcademicSemesterExist =
    await academicSemesterModel.findById(academicSemester);
  if (!isAcademicSemesterExist) {
    throw new AppError(404, 'Academic Semester does not exist');
  }

  //   check if the academic semester is already registered
  const isAcademicSemesterRegistered = await semesterRegistrationModel.findOne({
    academicSemester: academicSemester,
  });
  if (isAcademicSemesterRegistered) {
    throw new AppError(400, 'Academic Semester is already registered');
  }

  const result = await semesterRegistrationModel.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrations = new QueryBuilder(
    semesterRegistrationModel.find().populate('academicSemester'),
    query,
  )

    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await semesterRegistrations.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await semesterRegistrationModel
    .findById(id)
    .populate('academicSemester');
  return result;
};

export const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const isRequestedSemesterRegistrationExists =
    await semesterRegistrationModel.findById(id);
  // check if the requested semester registration exists
  if (!isRequestedSemesterRegistrationExists) {
    throw new AppError(404, 'Semester Registration does not exist');
  }
  const currentSemesterRegistrationStatus =
    isRequestedSemesterRegistrationExists?.status;
  // if the requested semester registration is ended will no be updated
  if (currentSemesterRegistrationStatus === registrationStatus.ENDED) {
    throw new AppError(400, 'Semester Registration has already ended');
  }

  const requestedSemesterStatus = payload.status;

  // UPCOMING-->ONGOING-->ENDED that will be sequence of status
  if (
    currentSemesterRegistrationStatus === registrationStatus.UPCOMING &&
    requestedSemesterStatus === registrationStatus.ENDED
  ) {
    throw new AppError(
      400,
      `Invalid status update: Transitioning directly from ${currentSemesterRegistrationStatus} to ${requestedSemesterStatus} is not allowed. Please ensure the status change follows the correct progression.`,
    );
  }
  if (
    currentSemesterRegistrationStatus === registrationStatus.ONGOING &&
    requestedSemesterStatus === registrationStatus.UPCOMING
  ) {
    throw new AppError(
      400,
      `Invalid status update: Transitioning directly from ${currentSemesterRegistrationStatus} to ${requestedSemesterStatus} is not allowed. Please ensure the status change follows the correct progression.`,
    );
  }

  const result = await semesterRegistrationModel.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true },
  );
  return result;
};

const semesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};

export default semesterRegistrationServices;

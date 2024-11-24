import { Types } from 'mongoose';

export type TName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';
type TFaculty = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TName;
  email: string;
  profileImg?: string;
  gender: 'male' | 'female' | 'other';
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  dateOfBirth?: Date;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  isDeleted: boolean;
};

export default TFaculty;

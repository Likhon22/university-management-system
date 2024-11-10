import { Date, Model, Types } from 'mongoose';

export type TName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};
export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
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
export type TStudent = {
  id: string;
  user: Types.ObjectId;
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
  guardian: TGuardian;
  localGuardian: TLocalGuardian;

  isDeleted: boolean;
};

export interface Student extends Model<TStudent> {
  isUserExists(id: string): Promise<TStudent | null>;
}

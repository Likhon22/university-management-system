import { model, Schema } from 'mongoose';
import TAcademicDepartment from './academicDepartment.interface';
import AppError from '../../app/error/AppError';

const academicDepartmentSchema = new Schema<TAcademicDepartment>({
  name: { type: String, required: true, unique: true },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    required: true,

    ref: 'AcademicFaculty',
  },
});

academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExists = await AcademicDepartmentModel.findOne({
    name: this.name,
  });
  if (isDepartmentExists) {
    throw new AppError(409, 'Department already exists');
  }
  next();
});

// update
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isDepartmentExists = await AcademicDepartmentModel.findOne({ query });

  if (!isDepartmentExists) {
    throw new AppError(404, 'Department not found');
  }
  next();
});

const AcademicDepartmentModel = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);

export default AcademicDepartmentModel;

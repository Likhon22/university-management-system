import { model, Schema } from 'mongoose';
import TFaculty, { TName } from './faculty.interface';
import { BloodGroup } from './faculty.constants';
import AppError from '../../app/error/AppError';

const nameSchema = new Schema<TName>({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
});
const facultySchema = new Schema<TFaculty>(
  {
    id: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    designation: { type: String, required: true },
    name: nameSchema,
    email: { type: String, required: true, unique: true },
    profileImg: { type: String },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    dateOfBirth: {
      type: Date,
    },
    contactNo: {
      type: String,
      required: true,
    },
    emergencyContactNo: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: BloodGroup,
    },
    presentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

facultySchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const faculty = this;
  const isExist = await FacultyModel.findOne({ email: faculty.email });
  if (isExist) {
    throw new AppError(400, 'Faculty already exists');
  }
  next();
});
facultySchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
facultySchema.pre('findOne', async function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});
const FacultyModel = model<TFaculty>('Faculty', facultySchema);

export default FacultyModel;

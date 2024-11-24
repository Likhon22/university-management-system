import { model, Schema } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from './course.interface';

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  isDeleted: { type: Boolean, default: false },
});

const courseSchema = new Schema<TCourse>(
  {
    title: { type: String, required: true, unique: true, trim: true },
    prefix: { type: String, required: true },
    code: { type: Number, required: true, trim: true },
    credit: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    preRequisiteCourses: [preRequisiteCoursesSchema],
  },
  { timestamps: true },
);

export const CourseModel = model<TCourse>('Course', courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    unique: true,
    trim: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
  ],
});
export const CourseFacultyModel = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultySchema,
);

import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITeacherStudent extends Document {
  teacher: Types.ObjectId;
  student: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const teacherStudentSchema = new Schema<ITeacherStudent>(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// A student can be assigned to only one teacher
teacherStudentSchema.index({ student: 1 }, { unique: true });

export const TeacherStudent = mongoose.model<ITeacherStudent>(
  "TeacherStudent",
  teacherStudentSchema
);

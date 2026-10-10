import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  language: string;
  level: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: "English",
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "All Levels",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Course = mongoose.model<ICourse>("Course", courseSchema);

import mongoose, { Document, Schema, Types } from "mongoose";

export type SessionStatus = "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";

export interface ISession extends Document {
  title: string;
  description?: string;
  instructor: Types.ObjectId;
  course: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  meetingLink: string;
  status: SessionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    meetingLink: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
    },
  },
  {
    timestamps: true,
  },
);

export const Session = mongoose.model<ISession>("Session", sessionSchema);

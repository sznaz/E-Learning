import mongoose, { Document, Schema, Types } from "mongoose";

export type SessionStatus = "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";

export interface ISession extends Document {
  title: string;
  description?: string;
  course?: Types.ObjectId;
  instructor: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  meetingLink: string;
  status: SessionStatus;
  attendees: Types.ObjectId[];
  maxAttendees?: number;
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
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    maxAttendees: {
      type: Number,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const Session = mongoose.model<ISession>("Session", sessionSchema);

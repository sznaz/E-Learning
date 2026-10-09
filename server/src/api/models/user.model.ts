import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "STUDENT" | "TEACHER" | "SUPER_ADMIN";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "SUPER_ADMIN"],
      default: "STUDENT",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
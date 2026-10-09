import { ICreateUserPayload, IUpdateUserPayload } from "../../types";
import { User, IUser } from "../models/user.model";

export interface IUserFilterOptions {
  search?: string;
  role?: string;
}

class UserQueries {
  public create = async (payload: ICreateUserPayload): Promise<IUser> => {
    return User.create(payload);
  };

  public findById = async (id: string): Promise<IUser | null> => {
    return User.findById(id).select("-password").exec();
  };

  public findByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({ email }).exec();
  };

  public getAll = async (
    options: IUserFilterOptions = {}
  ): Promise<IUser[]> => {
    const filter: Record<string, any> = {};

    if (options.role) {
      filter.role = options.role;
    }

    if (options.search) {
      filter.$or = [
        { name: { $regex: options.search, $options: "i" } },
        { email: { $regex: options.search, $options: "i" } },
      ];
    }

    return User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean<IUser[]>()
      .exec();
  };

  public update = async (
    id: string,
    payload: IUpdateUserPayload
  ): Promise<IUser | null> => {
    return User.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .exec();
  };

  public delete = async (id: string): Promise<IUser | null> => {
    return User.findByIdAndDelete(id).select("-password").exec();
  };
}

export default UserQueries;

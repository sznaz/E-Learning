import bcrypt from "bcryptjs";
import Responses from "../../config/responses";
import {
  ICreateUserPayload,
  IUpdateUserPayload,
  IResponse,
} from "../../types";
import { IUser } from "../models/user.model";
import UserQueries, { IUserFilterOptions } from "../queries/user.queries";

const userQueries = new UserQueries();

class UserService {
  public createUser = async (
    payload: ICreateUserPayload
  ): Promise<IResponse<IUser | null>> => {
    const existing = await userQueries.findByEmail(payload.email.toLowerCase());
    if (existing) {
      return Responses.conflict("User with this email already exists");
    }

    const user = await userQueries.create({
      ...payload,
      email: payload.email.toLowerCase(),
    });
    return Responses.created(user, "User created successfully");
  };

  public getUsers = async (
    options: IUserFilterOptions = {}
  ): Promise<IResponse<IUser[]>> => {
    const result = await userQueries.getAll(options);
    return Responses.ok(result);
  };

  public getUserById = async (
    id: string
  ): Promise<IResponse<IUser | null>> => {
    const user = await userQueries.findById(id);
    if (!user) {
      return Responses.notFound("User not found");
    }
    return Responses.ok(user);
  };

  public updateUser = async (
    id: string,
    payload: IUpdateUserPayload
  ): Promise<IResponse<IUser | null>> => {
    if (payload.email) {
      const existing = await userQueries.findByEmail(payload.email.toLowerCase());
      if (existing && existing._id.toString() !== id) {
        return Responses.conflict("User with this email already exists");
      }
      payload.email = payload.email.toLowerCase();
    }

    if (payload.password) {
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);
    }

    const updatedUser = await userQueries.update(id, payload);
    if (!updatedUser) {
      return Responses.notFound("User not found");
    }
    return Responses.ok(updatedUser, "User updated successfully");
  };

  public deleteUser = async (
    id: string
  ): Promise<IResponse<IUser | null>> => {
    const deletedUser = await userQueries.delete(id);
    if (!deletedUser) {
      return Responses.notFound("User not found");
    }
    return Responses.ok(deletedUser, "User deleted successfully");
  };
}

export default UserService;

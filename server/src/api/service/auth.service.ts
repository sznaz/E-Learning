import Responses from "../../config/responses";
import {
  IRegisterPayload,
  ILoginPayload,
  IAuthResponseData,
  IResponse,
  IAuthUser,
} from "../../types";
import UserQueries from "../queries/user.queries";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../middlewares/auth.middleware";

const userQueries = new UserQueries();

class AuthService {
  public register = async (
    payload: IRegisterPayload
  ): Promise<IResponse<IAuthResponseData | null>> => {
    const email = payload.email.toLowerCase().trim();
    const existing = await userQueries.findByEmail(email);
    if (existing) {
      return Responses.conflict("User with this email already exists");
    }

    const user = await userQueries.create({
      ...payload,
      email,
    });

    const authUser: IAuthUser = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = generateAccessToken(authUser);
    const refreshToken = generateRefreshToken(authUser);
    const userSummary = user.toJSON();

    return Responses.created(
      {
        user: userSummary,
        token,
        refreshToken,
      },
      "User registered successfully"
    );
  };

  public login = async (
    payload: ILoginPayload
  ): Promise<IResponse<IAuthResponseData | null>> => {
    const email = payload.email.toLowerCase().trim();
    const user = await userQueries.findByEmail(email);
    if (!user) {
      return Responses.unauthorized("Invalid email or password");
    }

    const isMatch = await user.comparePassword(payload.password);
    if (!isMatch) {
      return Responses.unauthorized("Invalid email or password");
    }

    const authUser: IAuthUser = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = generateAccessToken(authUser);
    const refreshToken = generateRefreshToken(authUser);
    const userSummary = user.toJSON();

    return Responses.ok(
      {
        user: userSummary,
        token,
        refreshToken,
      },
      "Login successful"
    );
  };

  public refresh = async (
    refreshToken: string
  ): Promise<IResponse<IAuthResponseData | null>> => {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await userQueries.findById(decoded.id);
      if (!user) {
        return Responses.unauthorized("User no longer exists");
      }

      const authUser: IAuthUser = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const token = generateAccessToken(authUser);
      const newRefreshToken = generateRefreshToken(authUser);
      const userSummary = user.toJSON();

      return Responses.ok(
        {
          user: userSummary,
          token,
          refreshToken: newRefreshToken,
        },
        "Token refreshed successfully"
      );
    } catch {
      return Responses.unauthorized("Invalid or expired refresh token");
    }
  };

  public logout = async (): Promise<IResponse<null>> => {
    return Responses.ok(null, "Logged out successfully");
  };
}

export default AuthService;

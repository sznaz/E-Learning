import { IResponse } from "../types";

class Responses {
  public static ok<T>(data: T, message: string = "Success"): IResponse<T> {
    return {
      error: false,
      statusCode: 200,
      data,
      message,
    };
  }

  public static created<T>(
    data: T,
    message: string = "Created successfully"
  ): IResponse<T> {
    return {
      error: false,
      statusCode: 201,
      data,
      message,
    };
  }

  public static badRequest(message: string): IResponse<null> {
    return {
      error: true,
      statusCode: 400,
      message,
    };
  }

  public static notFound(message: string): IResponse<null> {
    return {
      error: true,
      statusCode: 404,
      message,
    };
  }

  public static conflict(message: string): IResponse<null> {
    return {
      error: true,
      statusCode: 409,
      message,
    };
  }

  public static serverError(message: string): IResponse<null> {
    return {
      error: true,
      statusCode: 500,
      message,
    };
  }
}

export default Responses;
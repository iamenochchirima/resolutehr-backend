export class HttpException extends Error {
    statusCode: number;
    errorCode: any;
    errors: any;
  
    constructor(
      message: string,
      errorCode: any,
      statusCode: number,
      errors: any = null 
    ) {
      super(message);
      Object.setPrototypeOf(this, HttpException.prototype); 
      this.errorCode = errorCode;
      this.statusCode = statusCode;
      this.errors = errors;
    }
  }
  

export enum ErrorCode {
  USER_NOT_FOUND = 404,
  INVALID_PASSWORD = 400,
  USER_ALREADY_EXISTS = 400,
  NOT_MATCHING_PASSWORDS = 400,
  NOT_VERIFIED = 400,
  UNAUTHORIZED = 401,
  INVALID_DATA = 400,
  INVALID_EMAIL = 400,
  INVALID_REQUEST = 400,
  INVALID_TOKEN = 400,
  INTERNAL_SERVER_ERROR = 500,
  INTERNAL_EXCEPTION = 500,
  DATABASE_ERROR = 500,
}

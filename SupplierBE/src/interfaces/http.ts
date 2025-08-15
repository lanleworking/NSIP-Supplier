export enum EStatusCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    CONFLICT = 409,
}
export interface IResponse<T> {
    status: EStatusCodes;
    data?: T;
    message?: string;
}
export interface IErrorResponse {
    status: number;
    message: string;
}

export interface IErrorResponse {
    status: number;
    message: string;
}

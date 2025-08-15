import { EStatusCodes, IErrorResponse } from '../interfaces/http';

export const throwResponse = (status: number, message: string) => {
    throw {
        status,
        message,
    };
};

export const catchResponse = (set: any, error: any) => {
    const er = error as IErrorResponse;
    set.status = er?.status || EStatusCodes.INTERNAL_SERVER_ERROR;
    throw {
        status: set.status,
        message: er?.message || 'Internal Server Error',
    };
};

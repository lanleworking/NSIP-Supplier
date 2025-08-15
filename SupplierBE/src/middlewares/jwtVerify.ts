import { EStatusCodes } from '../interfaces/http';
import { Supplier } from '../models/sync/Supplier';
import { AppDataSourceGlobal } from '../sql/config';
import type { Repository } from 'typeorm';

interface JWTToken {
    value?: string;
}

interface JWTPayload {
    supplierID: number;
    expiredTime: string | number;
    [key: string]: any;
}

let supplierRepo: Repository<Supplier> | null = null;

const UNAUTHORIZED_ERROR = Object.freeze({
    status: EStatusCodes.UNAUTHORIZED,
    message: 'Unauthorized',
});

const SUPPLIER_INACTIVE_ERROR = Object.freeze({
    status: EStatusCodes.UNAUTHORIZED,
    message: 'Unauthorized',
    CODE: 'SUPPLIER_INACTIVE',
});

const getSupplierRepo = (): Repository<Supplier> => {
    if (!supplierRepo) {
        supplierRepo = AppDataSourceGlobal.getRepository(Supplier);
    }
    return supplierRepo;
};

const isTokenExpired = (expiredTime: string | number): boolean => {
    const expiredDate = new Date(expiredTime);
    return expiredDate.getTime() < Date.now();
};

const jwtVerify = async (token: JWTToken, jwt: any, set: any): Promise<JWTPayload> => {
    const tokenValue = token?.value;
    if (!tokenValue) {
        set.status = EStatusCodes.UNAUTHORIZED;
        throw UNAUTHORIZED_ERROR;
    }

    let user: JWTPayload | null;
    try {
        user = await jwt.verify(tokenValue);
    } catch (error) {
        set.status = EStatusCodes.UNAUTHORIZED;
        throw UNAUTHORIZED_ERROR;
    }

    if (!user) {
        set.status = EStatusCodes.UNAUTHORIZED;
        throw UNAUTHORIZED_ERROR;
    }

    if (isTokenExpired(user.expiredTime)) {
        set.status = EStatusCodes.UNAUTHORIZED;
        throw UNAUTHORIZED_ERROR;
    }

    const repo = getSupplierRepo();
    const supplier = await repo.findOne({
        where: { SupplierID: user.supplierID },
        select: ['IsActive'],
    });

    if (!supplier) {
        set.status = EStatusCodes.UNAUTHORIZED;
        throw UNAUTHORIZED_ERROR;
    }

    if (!supplier.IsActive) {
        set.status = EStatusCodes.UNAUTHORIZED;
        throw SUPPLIER_INACTIVE_ERROR;
    }

    return user;
};

export default jwtVerify;

import { isEmpty } from 'lodash';
import { ILoginPayload, IRegisterPayload } from '../interfaces/payload';
import { throwResponse } from '../utils/response';
import { EStatusCodes } from '../interfaces/http';
import { decodeTwoWay, encodeString, encodeTwoWay } from '../utils/encode';
import { validateFields } from '../utils/validate';
import { Cookie } from 'elysia';
import { registerSchema } from '../constants/validate/auth';
import { nextDayMidnight } from '../utils/date';
import { Supplier } from '../models/sync/Supplier';
import { AppDataSourceGlobal } from '../sql/config';
import { sendResetPassMail } from '../services/mailer.service';
import type { Repository } from 'typeorm';

interface JWTService {
    sign(payload: any): Promise<string>;
    verify(token: string): Promise<any>;
}

interface ResetTokenPayload {
    email: string;
    expiredTime: string | number;
}

let supplierRepo: Repository<Supplier> | null = null;

const TOKEN_EXPIRY_SECONDS = 60 * 60 * 24; // 1 day
const RESET_TOKEN_EXPIRY_MS = 300000; // 5 minutes

const getSupplierRepo = (): Repository<Supplier> => {
    if (!supplierRepo) {
        supplierRepo = AppDataSourceGlobal.getRepository(Supplier);
    }
    return supplierRepo;
};

const createLoginWhereConditions = (loginName: string, hashedPassword: string) => {
    const conditions: any[] = [
        { LoginName: loginName, SupplierPass: hashedPassword },
        { PhoneNumber: loginName, SupplierPass: hashedPassword },
        { TaxCode: loginName, SupplierPass: hashedPassword },
    ];

    const loginAsNumber = Number(loginName);
    if (!isNaN(loginAsNumber)) {
        conditions.push({
            SupplierID: loginAsNumber,
            SupplierPass: hashedPassword,
        });
    }

    return conditions;
};

const sanitizeSupplierData = (supplier: Supplier) => {
    const { SupplierPass: _password, IsActive: _isActive, ...restData } = supplier;
    return restData;
};

const setTokenCookie = (set: any, token: string, maxAge: number, sameSite: 'Strict' | 'Lax' = 'Strict') => {
    set.headers['Set-Cookie'] = `token=${token}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=${sameSite};`;
};

export const login = async (payload: ILoginPayload, set: any, jwt: JWTService) => {
    // Early validation
    if (isEmpty(payload) || !payload.SupplierPass || !payload.LoginName) {
        return throwResponse(EStatusCodes.BAD_REQUEST, 'Thiếu thông tin đăng nhập');
    }

    const { LoginName, SupplierPass } = payload;
    const hashedPassword = encodeString(SupplierPass);
    const repo = getSupplierRepo();

    const whereConditions = createLoginWhereConditions(LoginName, hashedPassword);

    const supplier = await repo.findOne({
        where: whereConditions,
        select: [
            'SupplierID',
            'LoginName',
            'CompanyName',
            'TaxCode',
            'BusinessType',
            'Address',
            'PhoneNumber',
            'Email',
            'Website',
            'RepresentativeName',
            'RepresentativePosition',
            'BankID',
            'BankAccount',
            'PaymentTerms',
            'DeliveryTerms',
            'CreatedDate',
            'UpdatedDate',
            'Note',
        ],
    });

    if (isEmpty(supplier)) {
        return throwResponse(EStatusCodes.UNAUTHORIZED, 'Thông tin đăng nhập không đúng');
    }

    const expiredTime = new Date(Date.now() + TOKEN_EXPIRY_SECONDS * 1000);
    const token = await jwt.sign({
        supplierID: supplier!.SupplierID,
        loginName: supplier!.LoginName,
        expiredTime,
    });

    setTokenCookie(set, token, TOKEN_EXPIRY_SECONDS);

    return sanitizeSupplierData(supplier!);
};

export const register = async (payload: IRegisterPayload, set: any, jwt: JWTService) => {
    const error = validateFields(payload, registerSchema);
    if (error) throw throwResponse(EStatusCodes.BAD_REQUEST, error);

    const { LoginName, SupplierPass, CompanyName, RepresentativeName, PhoneNumber, Email } = payload;
    const repo = getSupplierRepo();

    const existingSupplier = await repo.findOne({
        where: { LoginName },
        select: ['SupplierID'],
    });

    if (existingSupplier) {
        throw throwResponse(EStatusCodes.CONFLICT, 'Nhà cung cấp đã tồn tại');
    }

    const hashedPassword = encodeString(SupplierPass);
    const currentTimestamp = new Date().getTime();

    const newSupplier = repo.create({
        LoginName: LoginName,
        SupplierID: currentTimestamp,
        SupplierPass: hashedPassword,
        CompanyName,
        RepresentativeName,
        PhoneNumber,
        Email,
        IsActive: true,
    });

    const savedSupplier = await repo.save(newSupplier);
    if (!savedSupplier) throw throwResponse(EStatusCodes.INTERNAL_SERVER_ERROR, 'Đăng ký không thành công');

    const nextDayMils = Number(nextDayMidnight(new Date(), { toMilliseconds: true }));
    const expiresIn = Math.floor((nextDayMils - currentTimestamp) / 1000);

    const token = await jwt.sign({
        loginName: savedSupplier.LoginName,
        supplierID: savedSupplier.SupplierID,
        expiresIn,
    });

    setTokenCookie(set, token, expiresIn, 'Lax');

    return sanitizeSupplierData(savedSupplier);
};

export const getLoggedUser = async (jwt: JWTService, set: any, token: Cookie<string | undefined>) => {
    if (!token?.value) {
        throw throwResponse(EStatusCodes.UNAUTHORIZED, '1.Phiên đăng nhập không hợp lệ');
    }

    const decoded = await jwt.verify(token.value);

    if (!decoded || !decoded.supplierID) {
        throw throwResponse(EStatusCodes.UNAUTHORIZED, '2.Phiên đăng nhập không hợp lệ');
    }

    const repo = getSupplierRepo();
    const supplier = await repo.findOne({
        where: { SupplierID: decoded.supplierID },
        select: [
            'SupplierID',
            'LoginName',
            'CompanyName',
            'TaxCode',
            'BusinessType',
            'Address',
            'PhoneNumber',
            'Email',
            'Website',
            'RepresentativeName',
            'RepresentativePosition',
            'BankID',
            'BankAccount',
            'PaymentTerms',
            'DeliveryTerms',
            'CreatedDate',
            'UpdatedDate',
            'Note',
        ],
    });

    if (!supplier) throw throwResponse(EStatusCodes.NOT_FOUND, 'Nhà cung cấp không tồn tại');

    return sanitizeSupplierData(supplier);
};

export const logOut = (set: any) => {
    setTokenCookie(set, '', 0, 'Lax');
    return { message: 'Đăng xuất thành công' };
};

export const resetPassword = async (LoginName: string, headers: Record<string, string | undefined>) => {
    if (!LoginName) throw throwResponse(EStatusCodes.BAD_REQUEST, 'Tên đăng nhập không được để trống');

    const repo = getSupplierRepo();
    const loginAsNumber = Number(LoginName);

    const whereConditions: any[] = [
        { LoginName },
        { PhoneNumber: LoginName },
        { Email: LoginName },
        { TaxCode: LoginName },
    ];

    if (!isNaN(loginAsNumber)) {
        whereConditions.push({ SupplierID: loginAsNumber });
    }

    const supplier = await repo.findOne({
        where: whereConditions,
        select: ['Email'],
    });

    if (!supplier) throw throwResponse(EStatusCodes.NOT_FOUND, 'Nhà cung cấp không tồn tại');

    const email = supplier.Email;
    const expiredTime = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
    const originUrl = headers?.origin || process.env.FRONTEND_URL;

    const payload: ResetTokenPayload = {
        email,
        expiredTime: expiredTime.toISOString(),
    };

    const token = encodeTwoWay(JSON.stringify(payload));
    const res = await sendResetPassMail(email!, token, originUrl);

    return {
        email,
        ...res,
    };
};

export const resetPasswordWithToken = async (token: string, newPassword: string) => {
    if (!token || !newPassword) throw throwResponse(EStatusCodes.BAD_REQUEST, 'Thiếu thông tin cần thiết');

    const decoded = decodeTwoWay(token);

    if (!decoded || !decoded.email || !decoded.expiredTime) {
        throw throwResponse(EStatusCodes.UNAUTHORIZED, 'Token không hợp lệ hoặc đã hết hạn');
    }

    if (new Date() > new Date(decoded.expiredTime)) {
        throw throwResponse(EStatusCodes.UNAUTHORIZED, 'Yêu cầu không hợp lệ');
    }

    const repo = getSupplierRepo();
    const supplier = await repo.findOne({
        where: { Email: decoded.email },
        select: ['SupplierID', 'SupplierPass'],
    });

    if (!supplier) throw throwResponse(EStatusCodes.NOT_FOUND, 'Nhà cung cấp không tồn tại');

    const hashedPassword = encodeString(newPassword);
    supplier.SupplierPass = hashedPassword;

    await repo.save(supplier);

    return { message: 'Mật khẩu đã được cập nhật thành công' };
};

export const updateSupplier = async (supplierID: number, updateData: Partial<Supplier>) => {
    if (!supplierID || !updateData) throw throwResponse(EStatusCodes.BAD_REQUEST, 'Thiếu thông tin cần thiết');

    if (updateData.SupplierID && updateData.SupplierID !== supplierID) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'Lỗi thông tin');
    }

    const repo = getSupplierRepo();
    const supplier = await repo.findOne({
        where: { SupplierID: supplierID },
    });

    if (!supplier) throw throwResponse(EStatusCodes.NOT_FOUND, 'Nhà cung cấp không tồn tại');

    Object.assign(supplier, {
        ...updateData,
        UpdatedDate: new Date(),
    });

    const updatedSupplier = await repo.save(supplier);

    return sanitizeSupplierData(updatedSupplier);
};

export const updateSupplierPassword = async (supplierID: number, payload: { oldPass: string; newPass: string }) => {
    if (!supplierID || !payload.newPass || !payload.oldPass) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'Thiếu thông tin cần thiết');
    }

    const { oldPass, newPass } = payload;
    const repo = getSupplierRepo();
    const supplier = await repo.findOne({
        where: { SupplierID: supplierID },
        select: ['SupplierID', 'SupplierPass'],
    });

    if (!supplier) throw throwResponse(EStatusCodes.NOT_FOUND, 'Nhà cung cấp không tồn tại');

    const oldHashedPassword = encodeString(oldPass);
    if (supplier.SupplierPass !== oldHashedPassword) {
        throw throwResponse(EStatusCodes.UNAUTHORIZED, 'Mật khẩu cũ không đúng');
    }

    const newHashedPassword = encodeString(newPass);
    if (supplier.SupplierPass === newHashedPassword) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'Mật khẩu mới không được trùng với mật khẩu cũ');
    }

    supplier.SupplierPass = newHashedPassword;

    await repo.save(supplier);

    return { message: 'Mật khẩu đã được cập nhật thành công' };
};

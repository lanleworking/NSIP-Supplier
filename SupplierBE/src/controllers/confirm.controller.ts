import dayjs from 'dayjs';
import { EStatusCodes } from '../interfaces/http';
import { Request_List } from '../models/default/Request_List';
import { RequestConfirm } from '../models/sync/RequestConfirm';
import { Supplier } from '../models/sync/Supplier';
import { sendConfirmMail } from '../services/mailer.service';
import { AppDataSourceGlobal } from '../sql/config';
import { throwResponse } from '../utils/response';
import type { Repository } from 'typeorm';

interface ConfirmRequestResponse {
    message: string;
    data: RequestConfirm;
}

let confirmRepo: Repository<RequestConfirm> | null = null;
let requestRepo: Repository<Request_List> | null = null;
let supplierRepo: Repository<Supplier> | null = null;

const getConfirmRepo = (): Repository<RequestConfirm> => {
    if (!confirmRepo) {
        confirmRepo = AppDataSourceGlobal.getRepository(RequestConfirm);
    }
    return confirmRepo;
};

const getRequestRepo = (): Repository<Request_List> => {
    if (!requestRepo) {
        requestRepo = AppDataSourceGlobal.getRepository(Request_List);
    }
    return requestRepo;
};

const getSupplierRepo = (): Repository<Supplier> => {
    if (!supplierRepo) {
        supplierRepo = AppDataSourceGlobal.getRepository(Supplier);
    }
    return supplierRepo;
};

const isRequestExpired = (timeLimit: string): boolean => {
    return new Date(timeLimit) < new Date();
};

const formatConfirmationDate = (date: Date): string => {
    return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
};

export const confirmRequest = async (requestId: number, supplierId: number): Promise<ConfirmRequestResponse> => {
    if (!requestId || !supplierId) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'Dữ liệu không hợp lệ');
    }

    const requestRepoInstance = getRequestRepo();
    const confirmRepoInstance = getConfirmRepo();
    const supplierRepoInstance = getSupplierRepo();

    const request = await requestRepoInstance.findOne({
        where: { Id_Request: requestId },
        select: ['ID', 'TimeLimit'], // Only select needed fields
    });

    if (!request) {
        throw throwResponse(EStatusCodes.NOT_FOUND, 'Yêu cầu không tồn tại');
    }

    if (isRequestExpired(request.TimeLimit)) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'Yêu cầu đã hết hạn');
    }

    const [existingConfirm, supplier] = await Promise.all([
        confirmRepoInstance.findOne({
            where: {
                RequestId: request.ID,
                SupplierId: supplierId,
            },
            select: ['ID', 'IsConfirmed', 'confirmAt'],
        }),
        supplierRepoInstance.findOne({
            where: { SupplierID: supplierId },
            select: ['SupplierID', 'Email'],
        }),
    ]);

    if (existingConfirm?.IsConfirmed) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'Yêu cầu đã được xác nhận trước đó');
    }

    if (!supplier) {
        throw throwResponse(EStatusCodes.NOT_FOUND, 'Nhà cung cấp không tồn tại');
    }

    const confirmationData: Partial<RequestConfirm> = {
        RequestId: request.ID,
        SupplierId: supplierId,
        IsConfirmed: true,
        confirmAt: new Date(),
    };

    if (existingConfirm) {
        confirmationData.ID = existingConfirm.ID;
    }

    const savedConfirm = await confirmRepoInstance.save(confirmationData);

    const emailPromise = sendConfirmMail(
        supplier.Email,
        requestId,
        supplier,
        formatConfirmationDate(savedConfirm.confirmAt),
    ).catch((error) => {
        console.error('Failed to send confirmation email:', error);
    });

    return {
        message: 'Yêu cầu đã được xác nhận thành công',
        data: savedConfirm,
    };
};

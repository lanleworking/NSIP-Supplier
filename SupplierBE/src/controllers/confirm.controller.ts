import dayjs from 'dayjs';
import { EStatusCodes } from '../interfaces/http';
import { Request_List } from '../models/Request_List';
import { sendConfirmMail } from '../services/mailer.service';
import { AppDataSourceGlobal } from '../sql/config';
import { throwResponse } from '../utils/response';
import type { Repository } from 'typeorm';
import { EApproveStatus } from '../interfaces/data';
import { RequestSupplier } from '../models/RequestSupplier';
import { Supplier } from '../models/Supplier';

interface ConfirmRequestResponse {
    message: string;
    data: RequestSupplier;
}

let confirmRepo: Repository<RequestSupplier> | null = null;
let requestRepo: Repository<Request_List> | null = null;
let supplierRepo: Repository<Supplier> | null = null;

const getConfirmRepo = async (): Promise<Repository<RequestSupplier>> => {
    if (!confirmRepo) {
        if (!AppDataSourceGlobal.isInitialized) {
            await AppDataSourceGlobal.initialize();
        }
        confirmRepo = AppDataSourceGlobal.getRepository(RequestSupplier);
    }
    return confirmRepo;
};

const getRequestRepo = async (): Promise<Repository<Request_List>> => {
    if (!requestRepo) {
        if (!AppDataSourceGlobal.isInitialized) {
            await AppDataSourceGlobal.initialize();
        }
        requestRepo = AppDataSourceGlobal.getRepository(Request_List);
    }
    return requestRepo;
};

const getSupplierRepo = async (): Promise<Repository<Supplier>> => {
    if (!supplierRepo) {
        if (!AppDataSourceGlobal.isInitialized) {
            await AppDataSourceGlobal.initialize();
        }
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

    const requestRepoInstance = await getRequestRepo();
    const confirmRepoInstance = await getConfirmRepo();
    const supplierRepoInstance = await getSupplierRepo();

    const request = await requestRepoInstance.findOne({
        where: { Id_Request: requestId },
        select: ['Id_Request', 'TimeLimit'], // Only select needed fields
    });

    if (!request) {
        throw throwResponse(EStatusCodes.NOT_FOUND, 'Yêu cầu không tồn tại');
    }

    if (request.TimeLimit && isRequestExpired(request.TimeLimit)) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'Yêu cầu đã hết hạn');
    }

    const [existingConfirm, supplier] = await Promise.all([
        confirmRepoInstance.findOne({
            where: {
                RequestId: request.Id_Request,
                SupplierId: supplierId,
            },
            select: ['ID', 'IsConfirmed', 'confirmAt'],
        }),
        supplierRepoInstance.findOne({
            where: { SupplierID: supplierId },
            select: ['SupplierID', 'Email', 'CompanyName'],
        }),
    ]);

    if (existingConfirm?.IsConfirmed) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'Yêu cầu đã được xác nhận trước đó');
    }

    if (!supplier) {
        throw throwResponse(EStatusCodes.NOT_FOUND, 'Nhà cung cấp không tồn tại');
    }

    const confirmationData: Partial<RequestSupplier> = {
        RequestId: request.Id_Request,
        SupplierId: supplierId,
        IsConfirmed: true,
        ApprovalStatus: EApproveStatus.PENDING,
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
        formatConfirmationDate(savedConfirm.confirmAt ?? new Date()),
    ).catch((error) => {
        console.error('Failed to send confirmation email:', error);
    });

    return {
        message: 'Yêu cầu đã được xác nhận thành công',
        data: savedConfirm,
    };
};

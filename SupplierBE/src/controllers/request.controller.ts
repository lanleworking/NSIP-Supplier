import { EStatusCodes } from '../interfaces/http';
import { IRequestItemParams, IRequestListParams } from '../interfaces/params';
import { Request } from '../models/default/Request';
import { Request_List } from '../models/default/Request_List';
import { AppDataSourceGlobal } from '../sql/config';
import { throwResponse } from '../utils/response';
import { RequestFile } from '../models/sync/RequestFile';
import { RequestConfirm } from '../models/sync/RequestConfirm';
import type { Repository } from 'typeorm';
import { EApproveStatus, IChartData } from '../interfaces/data';
import { COLLATION_RULE } from '../interfaces/sql';

// Types for better type safety
interface PageInfo {
    current: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface RequestListResponse {
    requests: Request_List[];
    page: PageInfo;
}

interface FileInfo {
    ID: number;
    filePath: string | undefined;
    fileName: string | undefined;
}

interface RequestDetailResponse {
    isDisable: boolean;
    confirmAt?: Date;
    data: Request[];
    files: FileInfo[];
}

// Cached repository instances for better performance
let requestRepo: Repository<Request_List> | null = null;
let requestItemRepo: Repository<Request> | null = null;
let fileRepo: Repository<RequestFile> | null = null;
let confirmRepo: Repository<RequestConfirm> | null = null;

// Constants
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_CURRENT_PAGE = 1;

// Helper functions to get repositories (lazy initialization)
const getRequestRepo = (): Repository<Request_List> => {
    if (!requestRepo) {
        requestRepo = AppDataSourceGlobal.getRepository(Request_List);
    }
    return requestRepo;
};

const getRequestItemRepo = (): Repository<Request> => {
    if (!requestItemRepo) {
        requestItemRepo = AppDataSourceGlobal.getRepository(Request);
    }
    return requestItemRepo;
};

const getFileRepo = (): Repository<RequestFile> => {
    if (!fileRepo) {
        fileRepo = AppDataSourceGlobal.getRepository(RequestFile);
    }
    return fileRepo;
};

const getConfirmRepo = (): Repository<RequestConfirm> => {
    if (!confirmRepo) {
        confirmRepo = AppDataSourceGlobal.getRepository(RequestConfirm);
    }
    return confirmRepo;
};

// Helper function to build confirmation condition
const buildConfirmationCondition = (
    options: {
        isConfirmed?: boolean;
        approvalStatus?: number;
        requestId?: number;
        search?: string;
    },
    existingConditions: string[] = [],
): string[] | undefined => {
    const condition = [...existingConditions]; // keep old ones

    if (options?.isConfirmed !== undefined) {
        const isConfirmedCondition = Boolean(Number(options.isConfirmed));
        if (isConfirmedCondition) {
            condition.push('Request_Confirm.IsConfirmed = 1');
        } else {
            condition.push('Request_Confirm.IsConfirmed = 0');
        }
    }

    if (options?.approvalStatus !== undefined) {
        condition.push(`Request_Confirm.ApprovalStatus = '${options.approvalStatus}'`);
    }

    return condition.length ? condition : undefined;
};
// Helper function to create page info
const createPageInfo = (current: number, limit: number, total: number): PageInfo => {
    const totalPages = Math.ceil(total / limit);
    return {
        current: Number(current),
        limit: Number(limit),
        total,
        totalPages,
    };
};

// Helper function to check if request is past deadline
const isRequestExpired = (timeLimit?: string): boolean => {
    if (!timeLimit) return false;
    return new Date(timeLimit) < new Date();
};

// Helper function to sanitize file data
const sanitizeFileData = (files: RequestFile[]): FileInfo[] => {
    return files.map((file) => ({
        ID: file.ID,
        filePath: file.filePath,
        fileName: file.fileName,
    }));
};

export const getAllRequest = async (params: IRequestListParams, supplierID: number): Promise<any> => {
    const {
        current = DEFAULT_CURRENT_PAGE,
        limit = DEFAULT_PAGE_SIZE,
        timeLimit = 'DESC',
        requestId,
        request,
        isConfirmed,
        approvalStatus,
    } = params || {};

    // Build confirmation condition efficiently
    let conditions: string[] = [];
    conditions =
        buildConfirmationCondition(
            {
                isConfirmed,
            },
            conditions,
        ) || [];
    conditions =
        buildConfirmationCondition(
            {
                approvalStatus,
            },
            conditions,
        ) || [];
    if (request) {
        conditions.push(`request.Request COLLATE ${COLLATION_RULE} LIKE '%${request}%'`);
    }
    if (requestId) {
        conditions.push(`request.Id_Request LIKE '%${requestId}%'`);
    }

    const repo = getConfirmRepo();
    const qb = await repo.createQueryBuilder('Request_Confirm');
    qb.leftJoinAndSelect('Request_Confirm.request', 'request').where('Request_Confirm.SupplierId = :supplierID', {
        supplierID,
    });

    if (conditions.length > 0) {
        qb.andWhere(conditions.join(' AND '));
    }

    const [requests, total] = await qb.getManyAndCount();

    const pageInfo = createPageInfo(current, limit, total);

    // Return empty result if current page exceeds total pages
    if (current > pageInfo.totalPages && pageInfo.totalPages > 0) {
        return {
            requests: [],
            page: {
                ...pageInfo,
                total: 0,
                totalPages: 0,
            },
        };
    }

    return {
        requests,
        page: pageInfo,
    };
};

export const getRequestById = async (
    requestId: number,
    supplierID: number,
    params?: IRequestItemParams,
): Promise<RequestDetailResponse> => {
    if (!requestId) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'ID yêu cầu không được để trống');
    }

    const requestRepo = getRequestRepo();
    const request = await requestRepo.findOne({
        where: { Id_Request: requestId },
        select: ['ID', 'TimeLimit'],
    });

    if (!request) {
        throw throwResponse(EStatusCodes.NOT_FOUND, 'Yêu cầu không tồn tại');
    }

    const isExpired = isRequestExpired(request.TimeLimit);

    const confirmRepo = getConfirmRepo();
    const requestConfirm = await confirmRepo.findOne({
        where: {
            RequestId: request.ID,
            SupplierId: supplierID,
        },
        select: ['IsConfirmed', 'confirmAt'],
    });

    const isDisable = isExpired || Boolean(requestConfirm?.IsConfirmed && !isExpired);

    const requestItemRepo = getRequestItemRepo();
    const queryBuilder = requestItemRepo
        .createQueryBuilder('Request')
        .leftJoinAndSelect('Request.prices', 'Request_Item_Price', 'Request_Item_Price.SupplierID = :supplierID', {
            supplierID,
        })
        .where('Request.Id_Request = :requestId', { requestId });

    if (params?.item) {
        queryBuilder.andWhere('Request.Item LIKE :item', {
            item: `%${params.item}%`,
        });
    }

    const requestItemList = await queryBuilder.getMany();

    const fileRepo = getFileRepo();
    const files = await fileRepo.find({
        where: {
            requestID: requestId,
            SupplierID: supplierID,
        },
        select: ['ID', 'filePath', 'fileName'],
    });

    return {
        isDisable,
        confirmAt: requestConfirm?.confirmAt,
        data: requestItemList,
        files: sanitizeFileData(files),
    };
};

export const getChartRequestList = async (supplierID: number): Promise<IChartData[]> => {
    if (!supplierID || supplierID <= 0) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'Supplier ID is required and must be valid');
    }

    const confirmRepo = getConfirmRepo();
    const unConfirmTotal = await confirmRepo.count({
        where: {
            SupplierId: supplierID,
            IsConfirmed: Boolean(0),
        },
    });

    const isApproved = await confirmRepo.count({
        where: {
            SupplierId: supplierID,
            ApprovalStatus: EApproveStatus.APPROVED,
        },
    });

    const isPending = await confirmRepo.count({
        where: {
            SupplierId: supplierID,
            ApprovalStatus: EApproveStatus.PENDING,
        },
    });

    const isRejected = await confirmRepo.count({
        where: {
            SupplierId: supplierID,
            ApprovalStatus: EApproveStatus.REJECTED,
        },
    });

    return [
        {
            name: 'Chưa gửi',
            value: unConfirmTotal,
            color: 'gray',
        },

        {
            name: 'Đã được phê duyệt',
            value: isApproved,
            color: 'green',
        },
        {
            name: 'Đang chờ duyệt',
            value: isPending,
            color: 'orange',
        },
        {
            name: 'Bị từ chối',
            value: isRejected,
            color: 'red',
        },
    ];
};

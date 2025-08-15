import { EStatusCodes } from '../interfaces/http';
import { IRequestItemParams, IRequestListParams } from '../interfaces/params';
import { Request } from '../models/default/Request';
import { Request_List } from '../models/default/Request_List';
import { AppDataSourceGlobal } from '../sql/config';
import { searchWithCollate } from '../utils/collation';
import { throwResponse } from '../utils/response';
import { RequestFile } from '../models/sync/RequestFile';
import { RequestConfirm } from '../models/sync/RequestConfirm';
import type { Repository } from 'typeorm';
import { IChartData } from '../interfaces/data';

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
    isConfirmed?: boolean,
    approvalStatus?: number,
    existingConditions: string[] = [],
): string[] | undefined => {
    const condition = [...existingConditions]; // keep old ones

    if (isConfirmed !== undefined) {
        const isConfirmedCondition = Boolean(Number(isConfirmed));
        if (isConfirmedCondition) {
            condition.push('Request_Confirm.IsConfirmed = 1');
        } else {
            condition.push('(Request_Confirm.IsConfirmed IS NULL OR Request_Confirm.IsConfirmed = 0)');
        }
    }

    if (approvalStatus !== undefined) {
        condition.push(`Request_Confirm.ApprovalStatus = '${approvalStatus}'`);
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

export const getAllRequest = async (params: IRequestListParams, supplierID: number): Promise<RequestListResponse> => {
    const {
        current = DEFAULT_CURRENT_PAGE,
        limit = DEFAULT_PAGE_SIZE,
        timeLimit = 'DESC',
        requestId,
        isConfirmed,
        approvalStatus,
    } = params || {};

    // Build confirmation condition efficiently
    let conditions: string[] = [];
    conditions = buildConfirmationCondition(isConfirmed, undefined, conditions) || [];
    conditions = buildConfirmationCondition(undefined, approvalStatus, conditions) || [];

    const repo = getRequestRepo();
    const [requests, total] = await searchWithCollate(
        repo,
        'Request_List',
        {
            Request: params?.request,
            Id_Request: requestId,
        },
        {
            orderBy: {
                column: 'Id_Request',
                direction: 'DESC',
            },
            limit,
            page: current,
            leftJoin: [
                {
                    relationName: 'RequestConfirms',
                    tableAlias: 'Request_Confirm',
                    condition: `Request_Confirm.SupplierId = ${supplierID}`,
                    extraCondition: conditions?.length ? conditions : undefined,
                },
            ],
        },
    );

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
        select: ['IsConfirmed'],
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
        data: requestItemList,
        files: sanitizeFileData(files),
    };
};

export const getChartRequestList = async (supplierID: number): Promise<IChartData[]> => {
    if (!supplierID || supplierID <= 0) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'Supplier ID is required and must be valid');
    }

    const repo = getRequestRepo();

    const confirmRepo = getConfirmRepo();
    const confirmsTotal = await confirmRepo.count({
        where: { SupplierId: supplierID, IsConfirmed: Boolean(1) },
    });

    const unConfirmTotal = await confirmRepo.count({
        where: {
            SupplierId: supplierID,
            IsConfirmed: Boolean(0),
        },
    });

    const requestTotal = await repo.count();

    return [
        {
            name: 'Chưa gửi',
            value: requestTotal - confirmsTotal + unConfirmTotal,
            color: 'gray',
        },
        {
            name: 'Đã gửi',
            value: confirmsTotal,
            color: 'green',
        },
    ];
};

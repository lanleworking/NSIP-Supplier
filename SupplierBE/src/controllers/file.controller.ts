import { EStatusCodes } from '../interfaces/http';
import { RequestFile } from '../models/sync/RequestFile';
import { AppDataSourceGlobal } from '../sql/config';
import { throwResponse } from '../utils/response';
import { saveFilesToLocal } from '../utils/saveFileToLocal';
import fs from 'fs/promises';
import type { Repository } from 'typeorm';

interface UploadFilePayload {
    files: File[];
    supplierId: number;
    requestId: number;
    removeFileIds: number[];
}

interface FileOperationResponse {
    message: string;
}

let fileRepo: Repository<RequestFile> | null = null;

const getFileRepo = (): Repository<RequestFile> => {
    if (!fileRepo) {
        fileRepo = AppDataSourceGlobal.getRepository(RequestFile);
    }
    return fileRepo;
};

const safeRemoveFile = async (filePath: string): Promise<void> => {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error(`Failed to remove file: ${filePath}`, error);
    }
};

const validateUploadPayload = (payload: any): payload is UploadFilePayload => {
    return payload && Array.isArray(payload.files) && payload.files.length > 0 && payload.supplierId, payload.requestId;
};

const removeFilesByIds = async (fileIds: number[], repo: Repository<RequestFile>): Promise<void> => {
    if (!fileIds || fileIds.length === 0) return;

    const filesToRemove = await repo.find({
        where: fileIds.map((id) => ({ ID: id })),
        select: ['ID', 'filePath'],
    });

    if (filesToRemove.length === 0) return;

    const [dbRemovalPromise, fileRemovalPromises] = [
        repo.delete(fileIds),
        filesToRemove.map((file) => (file.filePath ? safeRemoveFile(file.filePath) : Promise.resolve())),
    ];

    await Promise.all([dbRemovalPromise, ...fileRemovalPromises]);
};

export const uploadFile = async (payload: UploadFilePayload): Promise<FileOperationResponse> => {
    if (!validateUploadPayload(payload)) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'Dữ liệu không hợp lệ');
    }

    const { files, supplierId, requestId, removeFileIds } = payload;
    const repo = getFileRepo();

    const totalFiles = await repo.count({
        where: { requestID: requestId, SupplierID: supplierId },
    });
    if (totalFiles - removeFileIds.length + files.length > 5) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'Số lượng file vượt quá giới hạn cho phép (tối đa 5 file)');
    }
    const removalPromise = removeFilesByIds(removeFileIds, repo);

    const savedFiles = await saveFilesToLocal(files, supplierId, requestId);

    await removalPromise;

    const fileEntities = savedFiles.map((file) => ({
        filePath: file.filePath,
        fileName: file.fileName,
        requestID: requestId,
        SupplierID: supplierId,
    }));

    await repo.save(fileEntities);

    return { message: 'Files uploaded successfully' };
};

export const removeFile = async (fileId: number): Promise<FileOperationResponse> => {
    if (!fileId || fileId <= 0) {
        throw throwResponse(EStatusCodes.BAD_REQUEST, 'File ID lỗi');
    }

    const repo = getFileRepo();

    const file = await repo.findOne({
        where: { ID: fileId },
        select: ['ID', 'filePath'],
    });

    if (!file) {
        throw throwResponse(EStatusCodes.NOT_FOUND, 'Không tìm thấy file');
    }

    const [dbRemoval, fileRemoval] = await Promise.allSettled([
        repo.delete(fileId),
        file.filePath ? safeRemoveFile(file.filePath) : Promise.resolve(),
    ]);

    if (dbRemoval.status === 'rejected') {
        console.error('Failed to remove file from database:', dbRemoval.reason);
        throw throwResponse(EStatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi xóa file ');
    }

    if (fileRemoval.status === 'rejected') {
        console.error('Failed to remove file from filesystem:', fileRemoval.reason);
    }

    return { message: 'Đã xóa file thành công' };
};

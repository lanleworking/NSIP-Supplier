import path from 'path';
import fs from 'fs/promises';

interface SavedFileInfo {
    filePath: string;
    fileName: string;
}

const UPLOAD_BASE_DIR = 'public';
const MAX_FILENAME_LENGTH = 255;
const ALLOWED_FILE_EXTENSIONS = new Set([
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.txt',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.zip',
    '.rar',
]);

const sanitizeFilename = (filename: string): string => {
    const sanitized = filename
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '')
        .replace(/\.{2,}/g, '.')
        .replace(/^\.+|\.+$/g, '');

    if (sanitized.length > MAX_FILENAME_LENGTH) {
        const ext = path.extname(sanitized);
        const nameWithoutExt = path.basename(sanitized, ext);
        const maxNameLength = MAX_FILENAME_LENGTH - ext.length - 1;
        return nameWithoutExt.substring(0, maxNameLength) + ext;
    }

    return sanitized || 'unnamed_file';
};

const isAllowedFileType = (filename: string): boolean => {
    const ext = path.extname(filename).toLowerCase();
    return ALLOWED_FILE_EXTENSIONS.has(ext);
};

const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
        throw new Error(`Failed to create directory: ${dirPath}`);
    }
};

const generateUniqueFilename = (originalName: string): string => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitizedName = sanitizeFilename(originalName);
    const ext = path.extname(sanitizedName);
    const nameWithoutExt = path.basename(sanitizedName, ext);

    return `${timestamp}_${randomSuffix}_${nameWithoutExt}${ext}`;
};

/**
 * Save files to local storage with enhanced error handling and validation
 * @param files - Array of File objects to save
 * @param supplierId - Supplier ID for directory organization
 * @param requestId - Request ID for directory organization
 * @returns Promise<SavedFileInfo[]> - Array of saved file information
 */
export const saveFilesToLocal = async (
    files: File[],
    supplierId: number,
    requestId: number,
): Promise<SavedFileInfo[]> => {
    if (!Array.isArray(files) || files.length === 0) {
        throw new Error('No files provided for upload');
    }

    if (!supplierId || !requestId || supplierId <= 0 || requestId <= 0) {
        throw new Error('Invalid supplier ID or request ID');
    }

    for (const file of files) {
        if (!isAllowedFileType(file.name)) {
            throw new Error(`File type not allowed: ${file.name}`);
        }
    }

    try {
        const uploadDir = path.join(UPLOAD_BASE_DIR, supplierId.toString(), requestId.toString());
        await ensureDirectoryExists(uploadDir);

        const savePromises = files.map(async (file): Promise<SavedFileInfo> => {
            try {
                const uniqueFilename = generateUniqueFilename(file.name);
                const filePath = path.join(uploadDir, uniqueFilename);

                const buffer = Buffer.from(await file.arrayBuffer());

                if (buffer.length === 0) {
                    throw new Error(`File is empty: ${file.name}`);
                }

                await fs.writeFile(filePath, buffer);

                const normalizedPath = filePath.replace(/\\/g, '/');

                return {
                    filePath: normalizedPath,
                    fileName: file.name,
                };
            } catch (error) {
                console.error(`Error saving file ${file.name}:`, error);
                throw new Error(`Failed to save file: ${file.name}`);
            }
        });

        return await Promise.all(savePromises);
    } catch (error) {
        console.error('Error saving files to local storage:', error);
        throw new Error(`Failed to save files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

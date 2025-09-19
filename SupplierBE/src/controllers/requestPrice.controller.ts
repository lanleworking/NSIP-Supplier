import { EStatusCodes } from '../interfaces/http';
import { RequestItemPrice } from '../models/RequestItemPrice';
import { AppDataSourceGlobal } from '../sql/config';
import { throwResponse } from '../utils/response';

const getRequestItemPriceRepo = async () => {
    if (!AppDataSourceGlobal.isInitialized) {
        await AppDataSourceGlobal.initialize();
    }
    return AppDataSourceGlobal.getRepository(RequestItemPrice);
};

export const updateRequestItemPrice = async (
    requestId: number,
    supplierID: number,
    payload: Partial<RequestItemPrice>,
) => {
    if (!requestId) throw throwResponse(EStatusCodes.BAD_REQUEST, 'ID yêu cầu không được để trống');
    if (!supplierID) throw throwResponse(EStatusCodes.BAD_REQUEST, 'ID nhà cung cấp không được để trống');

    const requestItemPriceRepo = await getRequestItemPriceRepo();
    const existingRecord = await requestItemPriceRepo.findOne({
        where: {
            RequestItemId: requestId,
            SupplierID: supplierID,
            ID: payload?.ID,
        },
    });

    if (existingRecord) {
        const updatedRecord = Object.assign(existingRecord, payload);
        const res = await requestItemPriceRepo.save(updatedRecord);
        return res;
    } else {
        const newPrice = new RequestItemPrice();
        Object.assign(newPrice, payload, { RequestItemId: requestId, SupplierID: supplierID });
        const res = await requestItemPriceRepo.save(newPrice);
        return res;
    }
};

import { EStatusCodes } from '../interfaces/http';
import { AppDataSourceGlobal } from '../sql/config';
import { throwResponse } from '../utils/response';
import { RequestItemPrice } from '../models/sync/RequestItemPrice';

const requestItemPriceRepo = AppDataSourceGlobal.getRepository(RequestItemPrice);

export const updateRequestItemPrice = async (
    requestId: number,
    supplierID: number,
    payload: Partial<RequestItemPrice>,
) => {
    if (!requestId) throw throwResponse(EStatusCodes.BAD_REQUEST, 'ID yêu cầu không được để trống');
    if (!supplierID) throw throwResponse(EStatusCodes.BAD_REQUEST, 'ID nhà cung cấp không được để trống');

    const existingRecord = await AppDataSourceGlobal.getRepository(RequestItemPrice).findOne({
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

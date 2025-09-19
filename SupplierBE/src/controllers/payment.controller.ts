import { In } from 'typeorm';
import { paymentSchema } from '../constants/validate/payment';
import { EStatusCodes } from '../interfaces/http';
import { IPaymentPayload } from '../interfaces/payload';
import { AppDataSourceGlobal } from '../sql/config';
import { throwResponse } from '../utils/response';
import { validateFields } from '../utils/validate';
import { Payment } from '../models/Payment';

const getPaymentRepo = async () => {
    if (!AppDataSourceGlobal.isInitialized) {
        await AppDataSourceGlobal.initialize();
    }
    return AppDataSourceGlobal.getRepository(Payment);
};

export const createNewPayment = async (payload: IPaymentPayload | IPaymentPayload[]) => {
    const payments = Array.isArray(payload) ? payload : [payload];

    // Validate fields for all first
    for (const pay of payments) {
        const errors = validateFields(pay, paymentSchema);
        if (errors) throw throwResponse(EStatusCodes.BAD_REQUEST, errors);
    }

    // check for duplicates inside request body
    const ids = payments.map((p) => p.PaymentID);
    const duplicateInRequest = ids.filter((id, idx) => ids.indexOf(id) !== idx);
    if (duplicateInRequest.length) {
        throw throwResponse(
            EStatusCodes.BAD_REQUEST,
            `Trùng PaymentID trong request: ${duplicateInRequest.join(', ')}`,
        );
    }

    // check for existing in DB
    const paymentRepo = await getPaymentRepo();
    const existing = await paymentRepo.find({
        where: { PaymentID: In(ids) },
    });

    if (existing.length > 0) {
        throw throwResponse(
            EStatusCodes.CONFLICT,
            `Các PaymentID đã tồn tại: ${existing.map((e) => e.PaymentID).join(', ')}`,
        );
    }

    // insert all
    const newPayments = await paymentRepo.save(payments);
    return newPayments;
};

// -----------
/**
 * @DELETE
 * Remove one or more payment records.
 * @returns A success message.
 */
export const removePayment = async (paymentId: string | string[]) => {
    if (!paymentId) throw throwResponse(EStatusCodes.BAD_REQUEST, 'ID thanh toán không được để trống');
    const payments = Array.isArray(paymentId) ? paymentId : [paymentId];

    const paymentRepo = await getPaymentRepo();
    const result = await paymentRepo.delete(payments);
    if (result.affected === 0) throw throwResponse(EStatusCodes.NOT_FOUND, 'Thanh toán không tồn tại');

    return { message: 'Thanh toán đã được xóa thành công' };
};

// -----------
/**
 * @DELETE
 * Removes all payment records.
 * @returns A success message indicating that all payments have been removed.
 */
export const removeAllPayments = async () => {
    const paymentRepo = await getPaymentRepo();
    await paymentRepo.clear();

    return { message: 'Tất cả thanh toán đã được xóa thành công' };
};

// -----------
/**
 * @GET
 * Retrieves all payment records.
 * @returns An array of all payment records.
 * @throws {Error} If no payments are found.
 */
export const getAllPayments = async () => {
    const paymentRepo = await getPaymentRepo();
    const payments = await paymentRepo.find();
    return payments;
};

export const getAllPaymentsOptions = async () => {
    const paymentRepo = await getPaymentRepo();
    const payments = await paymentRepo.find();
    const options = payments.map((p) => ({
        label: p.PaymentName,
        value: p.PaymentID,
    }));
    return options;
};

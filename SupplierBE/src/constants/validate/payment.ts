import { IFieldValidation } from '../../interfaces/validate';

export const paymentSchema: IFieldValidation = {
    missingFieldMessage: 'Thông tin thanh toán không đầy đủ',
    fieldCheck: [
        { key: 'PaymentID', type: 'string', required: true },
        { key: 'PaymentName', type: 'string', required: true },
        { key: 'Description', type: 'string' },
        { key: 'Note', type: 'string' },
    ],
};

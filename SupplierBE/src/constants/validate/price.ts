import { IFieldValidation } from '../../interfaces/validate';

export const priceSchema: IFieldValidation = {
    missingFieldMessage: 'Thông tin hàng hóa không đầy đủ',
    fieldCheck: [
        { key: 'ID', type: 'number', required: true, missingMessage: 'RequestID không được để trống' },
        { key: 'Quantity', type: 'number', required: true, missingMessage: 'Quantity không được để trống' },
        { key: 'Unit', type: 'string', required: true, missingMessage: 'Unit không được để trống' },
        { key: 'Currency', type: 'string', required: true, missingMessage: 'Currency không được để trống' },
    ],
};

export const updateGoodsSchema: IFieldValidation = {
    missingFieldMessage: 'Thông tin cập nhật không đầy đủ',
    fieldCheck: [
        { key: 'Price', type: 'number', required: true, missingMessage: 'Price không được để trống' },
        { key: 'Tax', type: 'number', required: true, missingMessage: 'Tax không được để trống' },
        { key: 'TotalPrice', type: 'number', required: true, missingMessage: 'TotalPrice không được để trống' },
        { key: 'DeliveryTime', type: 'string', required: true, missingMessage: 'DeliveryTime không được để trống' },
        { key: 'PaymentType', type: 'string', required: true, missingMessage: 'PaymentType không được để trống' },
    ],
};

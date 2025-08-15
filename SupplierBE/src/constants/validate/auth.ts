import { IFieldValidation } from '../../interfaces/validate';

export const registerSchema: IFieldValidation = {
    missingFieldMessage: 'Thông tin đăng ký không đầy đủ',
    fieldCheck: [
        { key: 'SupplierPass', type: 'string', required: true },
        { key: 'LoginName', type: 'string', required: true },
        { key: 'CompanyName', type: 'string' },
        { key: 'RepresentativeName', type: 'string' },
        {
            key: 'PhoneNumber',
            type: 'string',
            required: true,
            invalidTypeMessage: 'Định dạng số điện thoại sai',
            validateType: 'phone',
        },
        {
            key: 'Email',
            type: 'string',
            validateType: 'email',
            invalidTypeMessage: 'Định dạng email sai',
        },
    ],
};

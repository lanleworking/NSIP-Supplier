import { IFieldValidation } from '../interfaces/validate';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{9,15}$/;

export const isNullOrEmpty = (val: any) => val === null || val === undefined || val === '';

export const validateFields = (payload: any, schema: IFieldValidation): string | null => {
    // If payload is an array -> validate each item
    if (isNullOrEmpty(payload)) return 'Invalid payload';

    if (Array.isArray(payload)) {
        for (const item of payload) {
            const error = validateFields(item, schema);
            if (error) return error;
        }
        return null;
    }

    // Single object validation
    for (const field of schema.fieldCheck) {
        const value = payload[field.key];

        // required field check
        if (field.required && isNullOrEmpty(value)) {
            return field.missingMessage || schema.missingFieldMessage;
        }

        // type validation
        if (!isNullOrEmpty(value) && typeof value !== field.type) {
            return field.invalidTypeMessage || `Định dạng ${field.key} không hợp lệ`;
        }

        // phone number validation
        if (field?.validateType === 'phone' && value) {
            if (!phoneRegex.test(value)) {
                return `Định dạng số điện thoại không hợp lệ`;
            }
        }

        // email validation
        if (field?.validateType === 'email' && value) {
            if (!emailRegex.test(value)) {
                return `Định dạng email không hợp lệ`;
            }
        }
    }

    return null;
};

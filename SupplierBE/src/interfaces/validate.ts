export interface IFieldCheck {
    key: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'phone';
    required?: boolean;
    missingMessage?: string;
    invalidTypeMessage?: string;
    validateType?: string; // e.g., 'email', 'phone'
}

export interface IFieldValidation {
    missingFieldMessage: string;
    fieldCheck: IFieldCheck[];
}

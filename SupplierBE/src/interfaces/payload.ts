export interface ILoginPayload {
    LoginName: string;
    SupplierPass: string;
}

export interface IRegisterPayload extends ILoginPayload {
    CompanyName: string;
    RepresentativeName: string;
    PhoneNumber: string;
    Email: string;
}

export interface IOnlyPaymentIDPayload {
    PaymentID: string | string[];
}

export interface IPaymentPayload {
    PaymentID: string;
    PaymentName: string;
    Description?: string;
    Note?: string;
}

export interface IGoodsPayload {
    RequestID: number;
    ItemID: number;
    ItemCode: number;
    ItemName: string;
    Quantity: number;
    Unit: string;
    Currency: string;
}

export interface IPageParams {
    current: number;
    limit: number;
}

export interface ISupplier {
    supplierID: number;
    LoginName: string;
}

export interface IChartData {
    name: string;
    value: number;
    color?: string;
}

export enum EApproveStatus {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 8,
}

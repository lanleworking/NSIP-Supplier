export interface ISupplier {
  Website?: string
  LoginName: string
  CompanyName: string
  PhoneNumber: string
  Email: string
  RepresentativeName: string
  CreatedDate: string
  UpdatedDate: string
  IsActive: boolean
  TradingName: string
  Address: string
  TaxCode: string
  BankAccount: string
  BankID: string
  BusinessType: string
  City: string
  RepresentativePosition: string
  PaymentTerms: string
  DeliveryTerms: string
  SupplierID: number
  Note: string
}

export interface IPageParams {
  current?: number
  limit?: number
}
export interface IPage extends IPageParams {
  total: number
  totalPages: number
}

export interface IRequestPrice {
  Price?: number
  Tax?: number
  TotalPrice?: number
  DeliveryTime?: string
  PaymentType?: string
  SupplierID?: number
  RequestItemId?: number
  ID?: number
}

export interface IRequestItem {
  ID: number
  Id_Request: number
  Id_Item: number
  Item_Code: number
  Item: string
  Quantity: number
  Unit: string
  Brand?: string
  Size?: string
  Note?: string
  prices?: IRequestPrice[]
}

export interface IRequestFile {
  ID: number
  fileName: string
  filePath: string
  requestId: number
}

export interface IRequestConfirm {
  IsConfirmed?: boolean
  confirmAt?: string
  ApprovalStatus?: number
}

export interface IRequestList {
  ID: number
  Id_Request: number
  Request: string
  TimeLimit: string
  RequestConfirms?: IRequestConfirm[]
}

export interface IOptions {
  label: string
  value: string
}

export interface IPayment {
  PaymentID: string
  PaymentName: string
  Description?: string
  Note?: string
}

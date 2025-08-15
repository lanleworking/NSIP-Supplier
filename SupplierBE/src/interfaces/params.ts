import { IPageParams } from './payload';
import { OrderByType } from './sql';

export interface IGoodsParams extends IPageParams {
    itemName?: string;
    itemCode?: number;
}

export interface IRequestListParams extends IPageParams {
    requestId?: number;
    request?: string;
    timeLimit?: OrderByType;
    isConfirmed?: boolean;
    approvalStatus?: number;
}

export interface IRequestItemParams extends IPageParams {
    item?: string;
}

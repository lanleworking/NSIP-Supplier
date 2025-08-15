import { Repository } from 'typeorm';
import { BusinessType } from '../models/sync/BusinessType';
import { AppDataSourceGlobal } from '../sql/config';

let businessRepo: Repository<BusinessType> | null = null;

const getBusinessTypeRepo = (): Repository<BusinessType> => {
    if (!businessRepo) {
        businessRepo = AppDataSourceGlobal.getRepository(BusinessType);
    }
    return businessRepo;
};

export const getBusinessByCode = async (code: string): Promise<BusinessType | null> => {
    const repo = getBusinessTypeRepo();
    return repo.findOne({
        where: { Code: code },
        select: ['Code', 'Name'],
    });
};

export const getAllBusinessOptions = async (): Promise<{ value: string; label: string }[]> => {
    const repo = getBusinessTypeRepo();
    const businessTypes = await repo.find({
        select: ['Code', 'Name'],
    });

    return businessTypes.map((business) => ({
        value: business.Code,
        label: business.Name || '',
    }));
};

import { Repository } from 'typeorm';
import { AppDataSourceGlobal } from '../sql/config';
import { BusinessType } from '../models/BusinessType';

let businessRepo: Repository<BusinessType> | null = null;

const getBusinessTypeRepo = async (): Promise<Repository<BusinessType>> => {
    if (!businessRepo) {
        if (!AppDataSourceGlobal.isInitialized) {
            await AppDataSourceGlobal.initialize();
        }
        businessRepo = AppDataSourceGlobal.getRepository(BusinessType);
    }
    return businessRepo;
};

export const getBusinessByCode = async (code: string): Promise<BusinessType | null> => {
    const repo = await getBusinessTypeRepo();
    return repo.findOne({
        where: { Code: code },
        select: ['Code', 'Name'],
    });
};

export const getAllBusinessOptions = async (): Promise<{ value: string; label: string }[]> => {
    const repo = await getBusinessTypeRepo();
    const businessTypes = await repo.find({
        select: ['Code', 'Name'],
    });

    return businessTypes.map((business) => ({
        value: business.Code,
        label: business.Name || '',
    }));
};

import { Repository } from 'typeorm';
import { BankList } from '../models/BankList';
import { AppDataSourceGlobal } from '../sql/config';
import { throwResponse } from '../utils/response';
import { EStatusCodes } from '../interfaces/http';

let bankRepo: Repository<BankList> | null = null;
const getBankListRepo = async (): Promise<Repository<BankList>> => {
    if (!bankRepo) {
        if (!AppDataSourceGlobal.isInitialized) {
            await AppDataSourceGlobal.initialize();
        }
        bankRepo = AppDataSourceGlobal.getRepository(BankList);
    }
    return bankRepo;
};

export const getBankOptions = async (): Promise<{ value: string; label: string }[]> => {
    const repo = await getBankListRepo();
    const bankLists = await repo.find({
        select: ['ID', 'Bank_Name', 'Brand_Name'],
    });

    return bankLists.map((bank) => ({
        value: bank.ID.toString(),
        label: `${bank.Brand_Name ?? ''} - ${bank.Bank_Name}`,
    }));
};

export const getBankById = async (id: number): Promise<BankList | null> => {
    if (!id) throw throwResponse(EStatusCodes.BAD_REQUEST, 'Invalid bank ID');
    const repo = await getBankListRepo();
    return repo.findOne({
        where: { ID: id },
        select: ['ID', 'Bank_Name'],
    });
};

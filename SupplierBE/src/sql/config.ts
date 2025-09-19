import { DataSource } from 'typeorm';

// Import all entities explicitly
import { Request } from '../models/Request';
import { Request_List } from '../models/Request_List';
import { BankList } from '../models/BankList';
import { Supplier } from '../models/Supplier';
import { RequestItemPrice } from '../models/RequestItemPrice';
import { RequestFile } from '../models/RequestFile';
import { RequestSupplier } from '../models/RequestSupplier';
import { Payment } from '../models/Payment';
import { Device } from '../models/Device';
import { BusinessType } from '../models/BusinessType';

export const AppDataSourceGlobal = new DataSource({
    type: 'mssql',
    host: process.env.SQL_HOST,
    port: Number(process.env.SQL_PORT),
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
    synchronize: process.env.DB_SYNC === 'true', // sync schema with database
    entities: [
        Request,
        Request_List,
        BankList,
        Supplier,
        RequestItemPrice,
        RequestFile,
        RequestSupplier,
        Payment,
        Device,
        BusinessType,
    ],
    logging: process.env.CODE_ENV === 'DEV' ? ['query', 'error'] : ['error'],
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
});

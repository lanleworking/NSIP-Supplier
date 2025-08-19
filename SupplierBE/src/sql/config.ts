import { DataSource } from 'typeorm';
import { Request } from '../models/default/Request';
import { Request_List } from '../models/default/Request_List';

export const AppDataSource = new DataSource({
    type: 'mssql',
    host: process.env.SQL_HOST,
    port: Number(process.env.SQL_PORT),
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
    synchronize: true,
    logging: false,
    entities: ['src/models/sync/*.ts', Request, Request_List],
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
});

export const AppDataSourceGlobal = new DataSource({
    type: 'mssql',
    host: process.env.SQL_HOST,
    port: Number(process.env.SQL_PORT),
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
    synchronize: false, // sync schema with database
    entities: ['src/models/default/*.ts', 'src/models/sync/*.ts'],
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
});

import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { RequestSupplier } from './RequestSupplier';
import { Request } from './Request';
import { RequestFile } from './RequestFile';

@Entity('Request_List')
export class Request_List {
    @PrimaryColumn({
        type: 'bigint',
    })
    Id_Request!: number;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    Request?: string;

    @Column({
        type: 'datetime',
        nullable: true,
    })
    TimeLimit?: string;

    @OneToMany(() => RequestSupplier, (requestSupplier) => requestSupplier.request)
    RequestSuppliers?: RequestSupplier[];

    @OneToMany(() => Request, (request) => request.requestList)
    requests?: Request[];

    @OneToMany(() => RequestFile, (requestFile) => requestFile.requestList)
    requestFiles?: RequestFile[];
}

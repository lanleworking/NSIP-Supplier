import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RequestConfirm } from '../sync/RequestConfirm';

@Entity('Request_List')
export class Request_List {
    @PrimaryGeneratedColumn()
    ID!: number;

    @Column({
        type: 'bigint',
        nullable: true,
    })
    Id_Request!: number;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    Request!: string;

    @Column({
        type: 'datetime',
        nullable: true,
    })
    TimeLimit!: string;

    @OneToMany(() => RequestConfirm, (requestConfirm) => requestConfirm.request)
    RequestConfirms?: RequestConfirm[];
}

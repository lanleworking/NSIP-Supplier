import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RequestItemPrice } from './RequestItemPrice';
import { Request_List } from './Request_List';

@Entity('Request')
export class Request {
    @PrimaryGeneratedColumn()
    ID!: number;

    @Column({
        type: 'bigint',
        nullable: true,
    })
    Id_Request!: number;

    @Column({
        type: 'float',
        nullable: true,
    })
    Id_Item!: number;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    Item_Code!: number;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    Item!: string;

    @Column({
        type: 'float',
        nullable: true,
    })
    Quantity!: number;

    @Column({
        type: 'nvarchar',
        length: 50,
        nullable: true,
    })
    Unit!: string;

    @Column({
        nullable: true,
        type: 'nvarchar',
        length: 255,
    })
    Brand?: string;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    Size?: string;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    Note?: string;

    @ManyToOne(() => Request_List, (requestList) => requestList.requests)
    @JoinColumn({ name: 'Id_Request', referencedColumnName: 'Id_Request' })
    requestList?: Promise<Request_List>;

    @OneToMany(() => RequestItemPrice, (requestItemPrice) => requestItemPrice.requestItem)
    prices?: RequestItemPrice[];
}

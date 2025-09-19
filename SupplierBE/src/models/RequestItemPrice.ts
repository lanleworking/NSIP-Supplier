import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Request } from './Request';

@Entity('Request_Item_Price')
export class RequestItemPrice {
    @PrimaryGeneratedColumn()
    ID!: number;

    @Column({
        type: 'bigint',
        nullable: true,
    })
    Price?: number;

    @Column({
        type: 'decimal',
        scale: 2,
        precision: 10,
        nullable: true,
    })
    Tax?: number;

    @Column({
        type: 'decimal',
        scale: 2,
        precision: 10,
        nullable: true,
    })
    TotalPrice?: number;

    @Column({
        type: 'date',
        nullable: true,
    })
    DeliveryTime?: Date;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    PaymentType?: string;

    @Column({
        type: 'bigint',
        nullable: true,
    })
    SupplierID?: number;

    @Column({
        type: 'int',
        nullable: true,
    })
    RequestItemId?: number;

    @ManyToOne(() => Request, (request) => request.prices)
    @JoinColumn({ name: 'RequestItemId', referencedColumnName: 'ID' })
    requestItem?: Promise<Request>;
}

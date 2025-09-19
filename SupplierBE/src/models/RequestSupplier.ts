import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Request_List } from './Request_List';

@Entity('Request_Supplier')
export class RequestSupplier {
    @PrimaryGeneratedColumn()
    ID!: number;

    @Column({
        type: 'bigint',
        nullable: true,
    })
    RequestId!: number;

    @Column({
        type: 'bigint',
    })
    SupplierId!: number;

    @Column({
        type: 'bit',
        default: false,
    })
    IsConfirmed!: boolean;

    /**
     * This field is used to store the approval status of the request.
     * @constant
     * 0 - Pending /
     * 1 - Approved /
     * 8 - Rejected
     */
    @Column({
        type: 'int',
        nullable: true,
    })
    ApprovalStatus?: number;

    @Column({
        type: 'datetime',
        nullable: true,
    })
    confirmAt?: Date;

    @ManyToOne(() => Request_List, (request) => request.RequestSuppliers)
    @JoinColumn({
        name: 'RequestId',
        referencedColumnName: 'Id_Request',
    })
    request?: Request;
}

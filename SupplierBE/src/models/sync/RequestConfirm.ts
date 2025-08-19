import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Request } from '../default/Request';
import { Request_List } from '../default/Request_List';

@Entity('Request_Confirm')
export class RequestConfirm {
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

    @ManyToOne(() => Request_List, (request) => request.RequestConfirms)
    @JoinColumn({
        name: 'RequestId',
        referencedColumnName: 'ID',
    })
    request?: Request;
}

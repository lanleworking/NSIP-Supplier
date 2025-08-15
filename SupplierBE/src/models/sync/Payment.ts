import { Column, Entity } from 'typeorm';

@Entity('Payment')
export class Payment {
    @Column({
        type: 'varchar',
        length: 50,
        unique: true,
        primary: true,
    })
    PaymentID!: string;

    @Column({
        type: 'nvarchar',
        length: 100,
        unique: true,
    })
    PaymentName!: string;

    @Column({
        nullable: true,
        type: 'nvarchar',
        length: 255,
    })
    Description?: string;

    @Column({
        type: 'nvarchar',
        length: 100,
        nullable: true,
    })
    Note?: string;
}

import { Column, Entity } from 'typeorm';

@Entity('Supplier')
export class Supplier {
    @Column({
        primary: true,
        type: 'bigint',
    })
    SupplierID!: number;

    @Column({
        type: 'varchar',
        length: 50,
        unique: true,
    })
    LoginName!: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    SupplierPass!: string;

    @Column({
        nullable: true,
        type: 'nvarchar',
        length: 255,
    })
    CompanyName?: string;

    @Column({
        nullable: true,
        type: 'varchar',
        length: 13,
    })
    TaxCode?: string;

    @Column({
        type: 'nvarchar',
        length: 100,
        nullable: true,
    })
    BusinessType?: string;

    @Column({
        nullable: true,
        type: 'nvarchar',
        length: 255,
    })
    Address?: string;

    @Column({
        type: 'varchar',
        length: 20,
    })
    PhoneNumber!: string;

    @Column({
        type: 'varchar',
        length: 100,
    })
    Email!: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    Website?: string;

    @Column({
        nullable: true,
        type: 'nvarchar',
        length: 100,
    })
    RepresentativeName?: string;

    @Column({
        type: 'nvarchar',
        length: 100,
        nullable: true,
    })
    RepresentativePosition?: string;

    @Column({
        type: 'bigint',
        nullable: true,
    })
    BankID?: string;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    BankAccount?: string;

    @Column({
        type: 'nvarchar',
        length: 100,
        nullable: true,
    })
    PaymentTerms?: string;

    @Column({
        type: 'nvarchar',
        length: 100,
        nullable: true,
    })
    DeliveryTerms?: string;

    @Column({
        type: 'bit',
        default: true,
    })
    IsActive!: boolean;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    CreatedDate!: Date;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    UpdatedDate!: Date;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    Note?: string;
}

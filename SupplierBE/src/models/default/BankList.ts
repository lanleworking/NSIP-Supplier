import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Bank_List')
export class BankList {
    @PrimaryGeneratedColumn({
        type: 'bigint',
    })
    ID!: number;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    Bank_Type?: string;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    Bank_Name?: string;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    SWIFT?: string;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    Brand_Name?: string;
}

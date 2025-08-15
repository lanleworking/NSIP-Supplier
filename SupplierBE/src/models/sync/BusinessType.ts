import { Column, Entity } from 'typeorm';

@Entity('Business_Type')
export class BusinessType {
    @Column({
        type: 'varchar',
        length: 50,
        primary: true,
    })
    Code!: string;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    Name?: string;
}

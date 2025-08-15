import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Request_File')
export class RequestFile {
    @PrimaryGeneratedColumn()
    ID!: number;

    @Column({
        type: 'bigint',
        nullable: true,
    })
    requestID?: number;

    @Column({
        type: 'bigint',
        nullable: true,
    })
    SupplierID?: number;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    filePath?: string;

    @Column({
        type: 'nvarchar',
        length: 255,
        nullable: true,
    })
    fileName?: string;
}

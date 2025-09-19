import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Request_List } from './Request_List';

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

    @ManyToOne(() => Request_List, (requestList) => requestList.requestFiles)
    @JoinColumn({ name: 'requestID', referencedColumnName: 'Id_Request' })
    requestList?: Promise<Request_List>;
}

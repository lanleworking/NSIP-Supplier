import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Device')
export class Device {
    @PrimaryGeneratedColumn({
        type: 'int',
    })
    Id!: number;

    @Column({
        type: 'nvarchar',
        length: 100,
        nullable: true,
    })
    Username?: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    UserId?: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    SystemManufacturer?: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    SystemModel?: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    SystemSerialNumber?: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    SystemUUID?: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    BaseBoardSerialNumber?: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    OSName?: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    IPv4?: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    MACAddress?: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    IPv6?: string;
}

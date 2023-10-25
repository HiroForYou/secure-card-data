// src/commerce.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Commerce {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    area: string;

    @Column()
    n_workers: number;
}

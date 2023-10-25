import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: string;

    @CreateDateColumn()
    created_at: Date;
}

// src/entity/bankaccount.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("bankaccount")
export class BankAccount {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "int" })
  totalAmount!: number;

  @Column({ type: "varchar", length: 150 })
  ifscCode!: string;

  @Column({ type: "varchar", length: 100 })
  bankName!: string;

  @Column({ type: "varchar", length: 100 })
  address!: string;

  @Column({ type: "varchar", length: 30 })
  accountNo!: string;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;
}

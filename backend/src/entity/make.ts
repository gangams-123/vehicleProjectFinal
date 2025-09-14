// src/entity/make.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("make")
export class Make {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "varchar", length: 100 })
  makeName!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  createdBy!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  updatedBy!: string;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;
}

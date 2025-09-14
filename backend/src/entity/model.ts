// src/entity/models.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Make } from "./make.js";

@Entity("model")
export class Model {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "varchar", length: 255 })
  modelName!: string;

  @ManyToOne(() => Make, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "makeId" })
  make!: Make;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;
}

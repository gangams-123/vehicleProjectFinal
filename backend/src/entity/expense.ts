import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { Department } from "./department.js";
import { WorkFlowMain } from "./workFlowMain.js";
import { ExpenseChild } from "./expenseChild.js";

@Entity({ name: "expense" })
export class Expense {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "int", unsigned: true, nullable: true })
  amount!: number;

  @Column({ type: "int", unsigned: true })
  deptId!: number;

  @Column({ type: "varchar" })
  status!: string;

  @Column({ type: "int", unsigned: true })
  stepOrder!: number;

  @Column({ type: "int", unsigned: true })
  workflowId!: number;

  // One-way relation to Department
  @ManyToOne(() => Department, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "deptId" })
  department!: Department;

  // One-way relation to WorkFlowMain
  @ManyToOne(() => WorkFlowMain, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "workflowId" })
  workflow!: WorkFlowMain;

  @OneToMany(() => ExpenseChild, (expenseChild) => expenseChild.expense)
  expenseChildren!: ExpenseChild[];

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;
  @CreateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;
}

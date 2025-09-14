// src/entity/WorkFlowChild.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "./role.js";
import { WorkFlowMain } from "./workFlowMain.js";

@Entity("workflowchild")
export class WorkFlowChild {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "varchar", length: 50 })
  status!: string;

  @Column({ type: "int" })
  stepOrder!: number;

  @ManyToOne(() => Role, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "roleId" })
  role!: Role;

  @ManyToOne(() => WorkFlowMain, (workFlowMain) => workFlowMain.WorkFlowChild, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  workFlowMain!: WorkFlowMain;
  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;
}

// src/entity/WorkFlowChild.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Role } from "./role.js";
import type { WorkFlowMain } from "./workFlowMain.js";

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

  @ManyToOne(
    // Lazy function returning class, avoids circular import
    (): typeof WorkFlowMain => require("./workFlowMain.js").WorkFlowMain,
    (main: WorkFlowMain) => main.WorkFlowChild,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "workFlowMainId" })
  workFlowMain!: WorkFlowMain;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;
}

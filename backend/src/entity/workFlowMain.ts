// src/entity/WorkFlowMain.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { WorkFlowChild } from "./WorkFlowChild.js";

@Entity("workflowmain")
export class WorkFlowMain {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "int", unsigned: true })
  noofWorkFlow!: number;

  @Column({ type: "varchar", length: 20 })
  module!: string;

  @Column({ type: "varchar", length: 20 })
  status!: string;

  @OneToMany(() => WorkFlowChild, (child) => child.workFlowMain, {
    cascade: true,
  })
  WorkFlowChild?: WorkFlowChild[];

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;
}

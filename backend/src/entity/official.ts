import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Department } from "./department.js";
import { Designation } from "./designation.js";
import { Role } from "./role.js";
import { Branch } from "./branch";

@Entity({ name: "official" })
export class Official {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "varchar", length: 20 })
  fName!: string;

  @Column({ type: "varchar", length: 20 })
  mName!: string;

  @Column({ type: "varchar", length: 20 })
  lName!: string;

  @Column({ type: "varchar", length: 50 })
  email!: string;

  @Column({ type: "varchar", length: 10 })
  gender!: string;

  @Column({ type: "date" })
  dob!: Date;

  @Column({ type: "varchar", length: 50 })
  guardianName!: string;

  @Column({ type: "varchar", length: 20 })
  guardianNum!: string;

  @Column({ type: "varchar", length: 20 })
  relationship!: string;

  @Column({ type: "varchar", length: 20 })
  mobile!: string;

  @Column({ type: "date" })
  joiningDate!: Date;

  @Column({ type: "varchar", length: 20 })
  basicsal!: string;

  @Column({ type: "boolean" })
  pf!: boolean;

  @Column({ type: "boolean" })
  esi!: boolean;

  @Column({ type: "varchar" })
  pfno!: string;

  @Column({ type: "varchar" })
  esino!: string;

  @Column({ type: "varchar" })
  password!: string;
  // Relations
  @ManyToOne(() => Department, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "departmentId" })
  department!: Department;

  @ManyToOne(() => Designation, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "designationId" })
  designation!: Designation;

  @ManyToOne(() => Branch, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "branchId" })
  branch!: Branch;

  @ManyToOne(() => Role, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "roleId" })
  role!: Role;

  // Timestamps

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;
}

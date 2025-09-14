import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Department } from "./department.js";

@Entity("designation")
export class Designation {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number; // Notice the '!' here

  @Column("varchar", { length: 100 })
  name!: string;

  @ManyToOne(() => Department, {
    onDelete: "CASCADE", // If department is deleted, its designations are deleted
  })
  @JoinColumn({ name: "departmentId" }) // This tells TypeORM to use departmentId as FK
  department!: Department;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;

  @Column("varchar", { length: 100, nullable: true, select: false })
  createdBy?: string;

  @Column("varchar", { length: 100, nullable: true, select: false })
  updatedBy?: string;
}

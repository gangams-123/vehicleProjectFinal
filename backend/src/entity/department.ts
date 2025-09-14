import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("department")
export class Department {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number; // Notice the '!' here

  @Column("varchar", { length: 100 })
  name!: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @Column("varchar", { length: 100, nullable: true })
  createdBy?: string;

  @Column("varchar", { length: 100, nullable: true })
  updatedBy?: string;
}

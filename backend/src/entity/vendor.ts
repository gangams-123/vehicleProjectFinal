import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Address } from "./address";

@Entity({ name: "vendor" })
export class Vendor {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ length: 20, type: "varchar" })
  companyName!: string;

  @Column({ length: 20, type: "varchar" })
  website!: string;

  @Column({ length: 2, type: "varchar" })
  accountNo!: string;

  @Column({ length: 20, type: "varchar" })
  ifscCode!: string;

  @Column({ length: 20, type: "varchar" })
  contactName!: string;

  @Column({ length: 20, type: "varchar" })
  gstNo!: string;

  @Column({ length: 20, type: "varchar" })
  contactEmail!: string;

  @Column({ length: 20, type: "varchar" })
  mobileNo!: string;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;
}

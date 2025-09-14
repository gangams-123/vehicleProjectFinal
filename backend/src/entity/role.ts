import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("role")
export class Role {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number; // Notice the '!' here

  @Column("varchar", { length: 100 })
  name!: string;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;

  @Column("varchar", { length: 100, nullable: true })
  createdBy?: string;

  @Column("varchar", { length: 100, nullable: true })
  updatedBy?: string;
}

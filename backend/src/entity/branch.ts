import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("branch")
export class Branch {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "varchar", length: 150 })
  branchName!: string;

  @Column({ type: "varchar", length: 60 })
  emailId!: string;

  @Column({ type: "varchar", length: 30 })
  url!: string;

  @Column({ type: "varchar", length: 30 })
  mobileNum!: string;

  @Column({ type: "varchar", length: 30 })
  phoneNum!: string;

  @Column({
    type: "enum",
    enum: ["mainBranch", "subBranch"],
  })
  officeType!: "mainBranch" | "subBranch";

  @Column({ type: "date" })
  establishedDate!: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;
}

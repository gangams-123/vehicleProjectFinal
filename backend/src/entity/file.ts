// src/entity/file.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

// You can export this for reuse elsewhere (like in services/controllers)
export const ENTITY_TYPE = {
  VENDOR: "vendor",
  CUSTOMER: "customer",
  OFFICIAL: "official",
  BANKACCOUNT: "bankaccount",
  BRANCH: "branch",
  EXPENSE: "expense",
} as const;

export type EntityType = (typeof ENTITY_TYPE)[keyof typeof ENTITY_TYPE];

@Entity("file")
@Index("entity_index", ["entityId", "entityType"])
export class File {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({
    type: "enum",
    enum: Object.values(ENTITY_TYPE),
  })
  entityType!: EntityType;

  @Column({ type: "int" })
  entityId!: number;

  @Column({ type: "varchar", length: 200 })
  fileName!: string;

  @Column({ type: "int" })
  size!: number;

  @Column({ type: "blob" })
  content!: Buffer;

  @Column({ type: "varchar", length: 200 })
  fileType!: string;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;
}

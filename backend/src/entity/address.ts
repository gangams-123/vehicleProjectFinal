import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

// src/constants/entity-type.ts (or wherever makes sense)

export const ENTITY_TYPE = {
  VENDOR: "vendor",
  CUSTOMER: "customer",
  OFFICIAL: "official",
  BANKACCOUNT: "bankaccount",
  BRANCH: "branch",
  EXPENSE: "expense",
} as const;

// This still gives you strong typing
export type EntityType = (typeof ENTITY_TYPE)[keyof typeof ENTITY_TYPE];

export type AddressType = "permanent" | "present" | "office";

@Entity("address")
@Index("entity_index", ["entityId", "entityType"])
export class Address {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({
    type: "enum",
    enum: ENTITY_TYPE,
  })
  entityType!: EntityType;

  @Column({ type: "enum", enum: ["permanent", "present", "office"] })
  addressType!: AddressType;

  @Column({ type: "int" })
  entityId!: number;

  @Column({ type: "varchar", length: 200 })
  street!: string;

  @Column({ type: "varchar", length: 100 })
  city!: string;

  @Column({ type: "varchar", length: 100 })
  state!: string;

  @Column({ type: "varchar", length: 20 })
  postalCode!: string;

  @Column({ type: "varchar", length: 20 })
  country!: string;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;
}

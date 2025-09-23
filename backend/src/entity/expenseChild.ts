import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import type { Expense } from "./expense.js";
import { Official } from "./official.js";

@Entity({ name: "expensechild" })
export class ExpenseChild {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id!: number;

  @Column({ type: "varchar" })
  status!: string;

  @Column({ type: "varchar" })
  remarks!: string;

  // Two-way ManyToOne to Expense
  @ManyToOne(
    () => require("./expenseChild.js.js").Expense, // ✅ use require for runtime reference
    (main: Expense) => main.expenseChildren,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "expenseId" })
  expense!: Expense;

  // One-way ManyToOne to Official
  @ManyToOne(() => Official, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "officialId" })
  official!: Official;

  @CreateDateColumn({ type: "timestamp", select: false })
  createdAt!: Date;

  @CreateDateColumn({ type: "timestamp", select: false })
  updatedAt!: Date;
}

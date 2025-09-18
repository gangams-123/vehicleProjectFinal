import { Request, Response } from "express";
import { BankAccountService } from "../service/bankAccount.service.js";

export class BankAccountController {
  private bankAccountService: BankAccountService;

  constructor(bankAccountService: BankAccountService) {
    this.bankAccountService = bankAccountService;
  }

  async createBankAccount(req: Request, res: Response) {
    try {
      const bankAccountData = JSON.parse(req.body.bankAccountData);

      const files = req.files as Express.Multer.File[];

      const result = await this.bankAccountService.createAccountWithFiles(
        bankAccountData,
        files
      );

      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating bank account:", error);
      res.status(500).json({ error: "Failed to create bankAccout." });
    }
  }

  async getBankAccountPaginated(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { total, items } =
        await this.bankAccountService.getBankAccountPaginated(page, limit);

      res.json({ page, limit, total, items });
    } catch (error) {
      console.error("Error fetching branch:", error);
      res.status(500).json({ error: "Failed to fetch bankaccount." });
    }
  }
}

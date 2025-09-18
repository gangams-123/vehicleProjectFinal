// src/branch/branch.service.ts

import { DataSource, EntityManager, Repository } from "typeorm";
import { BankAccount } from "../entity/bankAccount.js";
import { ENTITY_TYPE } from "../entity/address.js";
import { FileService } from "../service/file.service.js";

export class BankAccountService {
  private bankAccountRepository: Repository<BankAccount>;
  private dataSource: DataSource;
  private fileService: FileService;
  constructor(dataSource: DataSource, fileService: FileService) {
    this.dataSource = dataSource;
    this.bankAccountRepository = dataSource.getRepository(BankAccount);
    this.fileService = fileService;
  }

  async createAccountWithFiles(
    bankAccountData: Partial<BankAccount>,
    files: Express.Multer.File[]
  ): Promise<{ bankAccount: BankAccount }> {
    const queryRunner =
      this.bankAccountRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      const bankAccount = manager.create(BankAccount, bankAccountData);
      const savedAccount = await manager.save(bankAccount);

      // 2. Create multiple files
      const fileInputs = files.map((file) => ({
        fileName: file.originalname,
        size: file.size,
        content: file.buffer,
        fileType: file.mimetype,
      }));

      await this.fileService.createFile(
        ENTITY_TYPE.BANKACCOUNT,
        savedAccount.id,
        manager,
        fileInputs
      );

      // 4. Commit transaction
      await queryRunner.commitTransaction();

      return { bankAccount: savedAccount };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Transaction failed:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async getBankAccountPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    total: number;
    items: {
      bankAccount: BankAccount;
      file: { id: number; fileName: string }[];
    }[];
  }> {
    const skip = (page - 1) * limit;

    const [accounts, total] = await this.bankAccountRepository.findAndCount({
      skip,
      take: limit,
      order: { id: "ASC" },
    });

    const items = await Promise.all(
      accounts.map(async (account) => {
        const filesRaw = await this.fileService.getFilesByEntity(
          ENTITY_TYPE.BANKACCOUNT,
          account.id
        );

        const files = filesRaw.map((f) => ({
          id: f.id,
          fileName: f.fileName,
        }));

        return {
          bankAccount: account, // ✅ this is the fix
          file: files,
        };
      })
    );

    return { total, items };
  }
}

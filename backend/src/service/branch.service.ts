// src/branch/branch.service.ts

import { EntityManager, Repository } from "typeorm";
import { Branch } from "../entity/branch.js";
import { AddressService } from "../service/address.service.js";
import { Address, ENTITY_TYPE } from "../entity/address.js";
import { FileService } from "../service/file.service.js";

export class BranchService {
  private branchRepository: Repository<Branch>;
  private addressService: AddressService;
  private fileService: FileService;
  constructor(
    branchRepository: Repository<Branch>,
    addressService: AddressService,
    fileService: FileService
  ) {
    this.branchRepository = branchRepository;
    this.addressService = addressService;
    this.fileService = fileService;
  }

  async createBranchWithAddressAndFiles(
    branchData: Partial<Branch>,
    addressData: Omit<Partial<Address>, "entityType" | "entityId">[],
    files: Express.Multer.File[]
  ): Promise<{ branch: Branch; addresses: Address[] }> {
    const queryRunner =
      this.branchRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Use the transaction's manager for all operations
      const manager = queryRunner.manager;

      // 1. Create branch
      const branch = manager.create(Branch, branchData);
      const savedBranch = await manager.save(branch);

      // 2. Create multiple addresses
      const addresses = await this.addressService.createAddresses(
        manager,
        ENTITY_TYPE.BRANCH,
        savedBranch.id,
        addressData
      );

      // 3. Create multiple files
      const fileInputs = files.map((file) => ({
        fileName: file.originalname,
        size: file.size,
        content: file.buffer,
        fileType: file.mimetype,
      }));

      await this.fileService.createFile(
        ENTITY_TYPE.BRANCH,
        savedBranch.id,
        manager,
        fileInputs
      );

      // 4. Commit transaction
      await queryRunner.commitTransaction();

      return { branch: savedBranch, addresses };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Transaction failed:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async getBranchesPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    total: number;
    data: {
      branch: Branch;
      addressData: Omit<Address, "entityType" | "entityId">[];
      file: { id: number; fileName: string }[];
    }[];
  }> {
    const skip = (page - 1) * limit;

    const [branches, total] = await this.branchRepository.findAndCount({
      skip,
      take: limit,
      order: { id: "ASC" },
    });

    const data = await Promise.all(
      branches.map(async (branch) => {
        const addresses = await this.addressService.getAddressesByEntity(
          ENTITY_TYPE.BRANCH,
          branch.id
        );

        const filesRaw = await this.fileService.getFilesByEntity(
          ENTITY_TYPE.BRANCH,
          branch.id
        );

        const files = filesRaw.map((f) => ({
          id: f.id,
          fileName: f.fileName,
        }));

        return {
          branch,
          addressData: addresses,
          file: files,
        };
      })
    );

    return { total, data };
  }
  async getAllBranches(): Promise<{ data: Branch[] }> {
    const data = await this.branchRepository.find({
      order: { id: "ASC" },
    });
    return { data };
  }
}

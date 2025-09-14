// src/branch/branch.service.ts

import { Repository } from "typeorm";
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
    addressData: Omit<Partial<Address>, "entityType" | "entityId">,
    files: Express.Multer.File[]
  ): Promise<{ branch: Branch; address: Address }> {
    // 1. Create branch
    const branch = this.branchRepository.create(branchData);
    const savedBranch = await this.branchRepository.save(branch);

    // 2. Create address linked to this branch
    const address = await this.addressService.createAddress(
      ENTITY_TYPE.BRANCH,
      savedBranch.id,
      addressData
    );
    for (const file of files) {
      await this.fileService.createFile(ENTITY_TYPE.BRANCH, branch.id, {
        fileName: file.originalname,
        size: file.size,
        content: file.buffer,
        fileType: file.mimetype,
      });
    }

    return { branch: savedBranch, address };
  }

  async getBranchWithAddresses(
    branchId: number
  ): Promise<{ branch: Branch; addresses: Address[] } | null> {
    const branch = await this.branchRepository.findOneBy({ id: branchId });
    if (!branch) return null;

    const addresses = await this.addressService.getAddressesByEntity(
      ENTITY_TYPE.BRANCH,
      branchId
    );

    return { branch, addresses };
  }

  // Add other branch logic as needed
}

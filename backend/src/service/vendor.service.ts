// src/branch/branch.service.ts

import { Repository } from "typeorm";
import { Vendor } from "../entity/vendor.js";
import { AddressService } from "../service/address.service.js";
import { Address, ENTITY_TYPE } from "../entity/address.js";

export class VendorService {
  private vendorRepository: Repository<Vendor>;
  private addressService: AddressService;

  constructor(
    vendorRepository: Repository<Vendor>,
    addressService: AddressService
  ) {
    this.vendorRepository = vendorRepository;
    this.addressService = addressService;
  }

  async createVendorWithAddress(
    vendorData: Partial<Vendor>,
    addressData: Omit<Partial<Address>, "entityType" | "entityId">[]
  ): Promise<{ vendor: Vendor; address: Address[] }> {
    const queryRunner =
      this.vendorRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Use the transaction's manager for all operations
      const manager = queryRunner.manager;
      const vendor = this.vendorRepository.create(vendorData);
      const savedVendor = await this.vendorRepository.save(vendor);

      // 2. Create address linked to this branch
      const address = await this.addressService.createAddresses(
        manager,
        ENTITY_TYPE.VENDOR,
        vendor.id,
        addressData
      );
      await queryRunner.commitTransaction();
      return { vendor: savedVendor, address };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Transaction failed:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getVendorWithAddresses(
    vendorId: number
  ): Promise<{ vendor: Vendor; addresses: Address[] } | null> {
    const vendor = await this.vendorRepository.findOneBy({ id: vendorId });
    if (!vendor) return null;

    const addresses = await this.addressService.getAddressesByEntity(
      ENTITY_TYPE.VENDOR,
      vendorId
    );

    return { vendor, addresses };
  }

  // Add other branch logic as needed
}

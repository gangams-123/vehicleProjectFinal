// src/address/address.service.ts

import { Repository } from "typeorm";
import { Address, EntityType } from "../entity/address.js";

export class AddressService {
  private addressRepository: Repository<Address>;

  constructor(addressRepository: Repository<Address>) {
    this.addressRepository = addressRepository;
  }

  async createAddress(
    entityType: EntityType,
    entityId: number,
    addressData: Omit<Partial<Address>, "entityType" | "entityId">
  ): Promise<Address> {
    const address = this.addressRepository.create({
      ...addressData,
      entityType,
      entityId,
    });

    return await this.addressRepository.save(address);
  }

  async getAddressesByEntity(
    entityType: EntityType,
    entityId: number
  ): Promise<Address[]> {
    return await this.addressRepository.find({
      where: { entityType, entityId },
    });
  }

  async updateAddress(
    id: number,
    data: Partial<Address>
  ): Promise<Address | null> {
    const existing = await this.addressRepository.findOneBy({ id });
    if (!existing) return null;

    const updated = this.addressRepository.merge(existing, data);
    return await this.addressRepository.save(updated);
  }

  async deleteAddress(id: number): Promise<boolean> {
    const result = await this.addressRepository.delete(id);
    return result.affected === 1;
  }
}

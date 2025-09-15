// src/address/address.service.ts

import { EntityManager, Repository } from "typeorm";
import { Address, EntityType } from "../entity/address.js";

export class AddressService {
  private addressRepository: Repository<Address>;

  constructor(addressRepository: Repository<Address>) {
    this.addressRepository = addressRepository;
  }

  async createAddresses(
    manager: EntityManager,
    entityType: EntityType,
    entityId: number,
    addressesData: Omit<Partial<Address>, "entityType" | "entityId">[]
  ): Promise<Address[]> {
    const addressEntities = addressesData.map((addr) =>
      this.addressRepository.create({
        ...addr,
        entityType,
        entityId,
      })
    );

    return manager.save(addressEntities);
  }

  async getAddressesByEntity(
    entityType: EntityType,
    entityId: number
  ): Promise<Address[]> {
    return await this.addressRepository.find({
      where: { entityType, entityId },
      select: ["street", "country", "state", "city", "postalCode", "id"],
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

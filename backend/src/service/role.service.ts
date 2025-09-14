// src/service/role.service.ts

import { Repository, DataSource } from "typeorm";
import { Role } from "../entity/role.js";

export class RoleService {
  private roleRepo: Repository<Role>;

  constructor(roleRepo: Repository<Role>) {
    this.roleRepo = roleRepo;
  }

  async createRole(data: Partial<Role>): Promise<Role> {
    const role = this.roleRepo.create(data);
    return await this.roleRepo.save(role);
  }

  async getRolesPaginated(
    page = 1,
    limit = 10
  ): Promise<{ data: Role[]; total: number }> {
    const [data, total] = await this.roleRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: "ASC" },
    });
    return { data, total };
  }

  async getRoleById(id: number): Promise<Role | null> {
    return await this.roleRepo.findOneBy({ id });
  }

  async updateRole(id: number, data: Partial<Role>): Promise<Role | null> {
    await this.roleRepo.update(id, data);
    return await this.roleRepo.findOneBy({ id });
  }

  async deleteRole(id: number): Promise<{ affected?: number }> {
    const result = await this.roleRepo.delete(id);
    return { affected: result.affected ?? undefined };
  }
}

import { DeleteResult, Repository } from "typeorm";
import { Department } from "../entity/department.js";

export class DepartmentService {
  private departmentRepo: Repository<Department>;

  constructor(departmentRepo: Repository<Department>) {
    this.departmentRepo = departmentRepo;
  }

  async createDepartment(data: Partial<Department>): Promise<Department> {
    const department = this.departmentRepo.create(data);
    return await this.departmentRepo.save(department);
  }

  async getDepartmentsPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Department[]; total: number }> {
    const [data, total] = await this.departmentRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: "ASC" },
    });

    return { data, total };
  }

  async getDepartmentById(id: number): Promise<Department | null> {
    return await this.departmentRepo.findOneBy({ id });
  }

  async updateDepartment(
    id: number,
    data: Partial<Department>
  ): Promise<Department | null> {
    await this.departmentRepo.update(id, data);
    return await this.departmentRepo.findOneBy({ id });
  }
  async deleteDepartment(id: number): Promise<DeleteResult> {
    return await this.departmentRepo.delete(id);
  }
  async getAllDepartments(): Promise<{ data: Department[] }> {
    const data = await this.departmentRepo.find({
      order: { id: "ASC" },
    });

    return { data };
  }
}

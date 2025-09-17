import { Repository, DeleteResult } from "typeorm";
import { Designation } from "../entity/designation.js";

export class DesignationService {
  private designationRepo: Repository<Designation>;

  constructor(designationRepo: Repository<Designation>) {
    this.designationRepo = designationRepo;
  }

  async createDesignation(data: Partial<Designation>): Promise<Designation> {
    console.log(data);
    const designation = this.designationRepo.create(data);
    return await this.designationRepo.save(designation);
  }

  async getDesignationsPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: any[]; total: number }> {
    const query = this.designationRepo
      .createQueryBuilder("designation")
      .leftJoin("designation.department", "department")
      .select([
        "designation.id AS id",
        "designation.name AS name",
        "department.id AS departmentId",
        "department.name AS departmentName",
      ])
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("designation.id", "ASC");

    const [data, total] = await Promise.all([
      query.getRawMany(),
      query.getCount(),
    ]);

    return { data, total };
  }

  async getDesignationById(id: number): Promise<Designation | null> {
    return await this.designationRepo.findOneBy({ id });
  }

  async updateDesignation(
    id: number,
    data: Partial<Designation>
  ): Promise<Designation | null> {
    await this.designationRepo.update(id, data);
    return await this.designationRepo.findOneBy({ id });
  }

  async deleteDesignation(id: number): Promise<{ affected?: number }> {
    const result = await this.designationRepo.delete(id);
    return { affected: result.affected ?? undefined };
  }
  async getDesignationByDeptId(deptId: number): Promise<Designation[]> {
    const designations = await this.designationRepo.find({
      where: {
        department: {
          id: deptId,
        },
      },
    });

    return designations;
  }
}

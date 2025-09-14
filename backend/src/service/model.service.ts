import { Repository, DeleteResult } from "typeorm";
import { Model } from "../entity/model.js";

export class ModelService {
  private modelRepo: Repository<Model>;

  constructor(modelRepo: Repository<Model>) {
    this.modelRepo = modelRepo;
  }

  async createModel(data: Partial<Model>): Promise<Model> {
    const model = this.modelRepo.create(data);
    return await this.modelRepo.save(model);
  }

  async getModelsPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Model[]; total: number }> {
    const [data, total] = await this.modelRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: "ASC" },
    });
    return { data, total };
  }

  async getModelById(id: number): Promise<Model | null> {
    return await this.modelRepo.findOneBy({ id });
  }

  async updateModel(id: number, data: Partial<Model>): Promise<Model | null> {
    await this.modelRepo.update(id, data);
    return await this.modelRepo.findOneBy({ id });
  }

  async deleteModel(id: number): Promise<{ affected?: number }> {
    const result = await this.modelRepo.delete(id);
    return { affected: result.affected ?? undefined };
  }
}

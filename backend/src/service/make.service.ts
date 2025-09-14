import { DeleteResult, Repository } from "typeorm";
import { Make } from "../entity/make.js";

export class MakeService {
  private makeRepo: Repository<Make>;

  constructor(makeRepo: Repository<Make>) {
    this.makeRepo = makeRepo;
  }

  async createMake(data: Partial<Make>): Promise<Make> {
    const make = this.makeRepo.create(data);
    return await this.makeRepo.save(make);
  }

  async getMakesPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Make[]; total: number }> {
    const [data, total] = await this.makeRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: "ASC" },
    });

    return { data, total };
  }

  async getMakeById(id: number): Promise<Make | null> {
    return await this.makeRepo.findOneBy({ id });
  }

  async updateMake(id: number, data: Partial<Make>): Promise<Make | null> {
    await this.makeRepo.update(id, data);
    return await this.makeRepo.findOneBy({ id });
  }
  async deleteMake(id: number): Promise<DeleteResult> {
    return await this.makeRepo.delete(id);
  }
}

// src/file/file.service.ts

import { EntityManager, Repository } from "typeorm";
import { EntityType, File } from "../entity/file.js"; // adjust path as needed

export class FileService {
  private fileRepo: Repository<File>;

  constructor(fileRepo: Repository<File>) {
    this.fileRepo = fileRepo;
  }

  /**
   * Create and save a file for a given entity (polymorphic)
   */
  async createFile(
    entityType: EntityType,
    entityId: number,
    manager: EntityManager,
    fileData: {
      fileName: string;
      size: number;
      content: Buffer;
      fileType: string;
    }[]
  ): Promise<File[]> {
    const fileEntities = fileData.map((file) =>
      this.fileRepo.create({
        ...file,
        entityType,
        entityId,
      })
    );

    return manager.save(fileEntities);
  }

  async getFilesByEntity(
    entityType: EntityType,
    entityId: number
  ): Promise<File[]> {
    return this.fileRepo.find({
      where: { entityType, entityId },
      select: ["id", "fileName"], // only file name etc
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Optionally: delete file by ID
   */
  async deleteFile(fileId: number): Promise<boolean> {
    const result = await this.fileRepo.delete(fileId);
    return result.affected === 1;
  }
}

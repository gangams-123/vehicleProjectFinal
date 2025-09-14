// src/file/file.service.ts

import { Repository } from "typeorm";
import { File, EntityType } from "../entity/file.js";

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
    fileData: {
      fileName: string;
      size: number;
      content: Buffer;
      fileType: string;
    }
  ): Promise<File> {
    const file = this.fileRepo.create({
      ...fileData,
      entityType,
      entityId,
    });

    return this.fileRepo.save(file);
  }

  /**
   * Get all files for a specific entity
   */
  async getFilesByEntity(
    entityType: EntityType,
    entityId: number
  ): Promise<File[]> {
    return this.fileRepo.find({
      where: { entityType, entityId },
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

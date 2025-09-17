// src/branch/branch.service.ts

import { Repository } from "typeorm";
import { Official } from "../entity/official.js";
import { AddressService } from "../service/address.service.js";
import { Address, ENTITY_TYPE } from "../entity/address.js";
import { FileService } from "../service/file.service.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
export class OfficialService {
  private officialRepository: Repository<Official>;
  private addressService: AddressService;
  private fileService: FileService;
  constructor(
    officialRepository: Repository<Official>,
    addressService: AddressService,
    fileService: FileService
  ) {
    this.officialRepository = officialRepository;
    this.addressService = addressService;
    this.fileService = fileService;
  }

  async createOfficialWithAddressAndFiles(
    officialData: Partial<Official>,
    addressData: Omit<Partial<Address>, "entityType" | "entityId">[],
    files: Express.Multer.File[]
  ): Promise<{ official: Official }> {
    const queryRunner =
      this.officialRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const manager = queryRunner.manager;
      const plainPassword = officialData.password!;
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      officialData.password = hashedPassword;
      const official = manager.create(Official, officialData);
      const savedOfficial = await manager.save(official);

      // 2. Create multiple addresses
      const addresses = await this.addressService.createAddresses(
        manager,
        ENTITY_TYPE.OFFICIAL,
        savedOfficial.id,
        addressData
      );

      // 3. Create multiple files
      const fileInputs = files.map((file) => ({
        fileName: file.originalname,
        size: file.size,
        content: file.buffer,
        fileType: file.mimetype,
      }));

      await this.fileService.createFile(
        ENTITY_TYPE.OFFICIAL,
        savedOfficial.id,
        manager,
        fileInputs
      );

      // 4. Commit transaction
      await queryRunner.commitTransaction();
      this.sendWelcomeEmail(
        savedOfficial.email,
        officialData.fName!,
        plainPassword
      );
      return { official: savedOfficial };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Transaction failed:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async checkEmailExists(email: string) {
    return await this.officialRepository.findOne({ where: { email } });
  }
  private async sendWelcomeEmail(
    email: string,
    firstName: string,
    password: string
  ) {
    const transporter = nodemailer.createTransport({
      host: "smtp.example.com", // e.g. smtp.gmail.com
      port: 587,
      secure: false,
      auth: {
        user: "your_email@example.com",
        pass: "your_email_password",
      },
    });
    const mailOptions = {
      from: '"Your Company" <your_email@example.com>',
      to: email,
      subject: "Your Login Credentials",
      html: `
      <p>Hi <b>${name}</b>,</p>
      <p>Your account has been created. Below are your login credentials:</p>
      <p><b>Username:</b> ${email}<br/><b>Password:</b> ${password}</p>
      <p>Please change your password after logging in for the first time.</p>
      <p>Regards,<br/>Admin Team</p>
    `,
    };

    await transporter.sendMail(mailOptions);
  }
  async getOfficialWithAddresses(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: {
      official: Official;
      addressData: Omit<Address, "entityType" | "entityId">[];
      file: { id: number; fileName: string }[];
    }[];
    total: number;
  }> {
    const [officials, total] = await this.officialRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: "ASC" },
    });
    const data = await Promise.all(
      officials.map(async (official) => {
        const addresses = await this.addressService.getAddressesByEntity(
          ENTITY_TYPE.OFFICIAL,
          official.id
        );

        const filesRaw = await this.fileService.getFilesByEntity(
          ENTITY_TYPE.OFFICIAL,
          official.id
        );

        const files = filesRaw.map((f) => ({
          id: f.id,
          fileName: f.fileName,
        }));

        return {
          official,
          addressData: addresses,
          file: files,
        };
      })
    );
    return { data, total };
  }
}

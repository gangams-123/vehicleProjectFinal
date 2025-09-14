// src/branch/branch.service.ts

import { Repository } from "typeorm";
import { Official } from "../entity/official.js";
import { AddressService } from "../service/address.service.js";
import { Address, ENTITY_TYPE } from "../entity/address.js";
import { FileService } from "../service/file.service.js";

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
    addressData: Omit<Partial<Address>, "entityType" | "entityId">,
    files: Express.Multer.File[]
  ): Promise<{ official: Official; address: Address }> {
    const official = this.officialRepository.create(officialData);
    const savedOfficial = await this.officialRepository.save(official);

    const address = await this.addressService.createAddress(
      ENTITY_TYPE.OFFICIAL,
      savedOfficial.id,
      addressData
    );
    for (const file of files) {
      await this.fileService.createFile(
        ENTITY_TYPE.OFFICIAL,
        savedOfficial.id,
        {
          fileName: file.originalname,
          size: file.size,
          content: file.buffer,
          fileType: file.mimetype,
        }
      );
    }

    return { official: savedOfficial, address };
  }

  async getOfficialWithAddresses(
    officialId: number
  ): Promise<{ official: Official; addresses: Address[] } | null> {
    const official = await this.officialRepository.findOneBy({
      id: officialId,
    });
    if (!official) return null;

    const addresses = await this.addressService.getAddressesByEntity(
      ENTITY_TYPE.OFFICIAL,
      officialId
    );

    return { official, addresses };
  }
}

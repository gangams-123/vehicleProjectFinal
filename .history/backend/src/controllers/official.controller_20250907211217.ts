 import { Request, Response } from "express";
import sequelize from "../config/db.js";
 import multer from "multer";
import Official from "../models/official.model.js"
import Address from "../models/address.model.js";
import File from "../models/file.model.js";
const storage = multer.memoryStorage(); 
export const upload = multer({ storage: storage, limits: { fileSize: 100 * 1024 * 1024 } });
export const createOfficialWithAddressAndFile = async (req: Request, res: Response) => {
  console.log(req.body);
  const t = await sequelize.transaction();
  try {
    const {addresses, ...officialData } = req.body;
    let address = Address;
if (typeof Address === 'string') {
  address = JSON.parse(Address);  // Convert JSON string to array
}
      let newAddresses: Address[] = [];
      let newFiles:File[]=[];
    const newOfficial = await Official.create(officialData, { transaction: t });

    if (address && address.length > 0) {
      const addressData = address.map((addr: any) => ({
        ...addr,
        entityId: newOfficial.id,
        entityType: "official",
      }));    
       newAddresses =await Address.bulkCreate(addressData, { transaction: t });
    }
        const files = req.files as Express.Multer.File[];
  await Promise.all(
  files.map(file => File.create({
    fileName: file.originalname,
    size: file.size,
    content: file.buffer,
    fileType:file.mimetype,
    entityType: "official",
    entityId: newOfficial.id
  },{transaction: t}))
); 
    await t.commit();
const officialJSON = { ...newOfficial.toJSON(), id: newOfficial.id };
    res.status(201).json({
      message: "official and address and files created successfully",
      data: { ...officialJSON },
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating official with addresses and files:", error);
    res.status(500).json({ message: "Failed to create official with addresses and files", error });
  }
};
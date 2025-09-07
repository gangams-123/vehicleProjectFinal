 import { Request, Response } from "express";
import sequelize from "../config/db.js";
 import multer from "multer";
import Official from "../models/official.model.js"
import Address from "../models/address.model.js";
import File from "../models/file.model.js";
const storage = multer.memoryStorage(); 
export const upload = multer({ storage: storage, limits: { fileSize: 100 * 1024 * 1024 } });

export const createBranchWithAddressAndFile = async (req: Request, res: Response) => {
  console.log(req.body);
  const t = await sequelize.transaction();
  try {
    const {addresses, ...officialData } = req.body;
      let newAddresses: Address[] = [];
      let newFiles:File[]=[];
    const newBranch = await Official.create(officialData, { transaction: t });

    if (addressesJson && addressesJson.length > 0) {
      const addressData = addressesJson.map((addr: any) => ({
        ...addr,
        entityId: newBranch.id,
        entityType: "branch" 
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
    entityType: "branch",
    entityId: newBranch.id
  },{transaction: t}))
); 
    
    await t.commit();
const branchJSON = { ...newBranch.toJSON(), id: newBranch.id };
    res.status(201).json({
      message: "branch and address and files created successfully",
      data: { ...branchJSON },
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating branch with addresses and files:", error);
    res.status(500).json({ message: "Failed to create branch with addresses and files", error });
  }
};
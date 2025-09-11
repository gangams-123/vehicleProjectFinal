import { Request, Response } from "express";
import sequelize from "../config/db.js";
import multer from "multer";
import BranchMaster from "../models/branchMaster.model.js";
import Address from "../models/address.model.js";
import File from "../models/file.model.js";
const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});
export const createBranchWithAddressAndFile = async (
  req: Request,
  res: Response
) => {
  console.log(req.body);
  const t = await sequelize.transaction();
  try {
    const { addresses, ...branchData } = req.body;
    let newAddresses: Address[] = [];
    let newFiles: File[] = [];
    const newBranch = await BranchMaster.create(branchData, { transaction: t });
    if (typeof addresses === "string") {
      try {
        const addressesJson = JSON.parse(addresses);
        console.log(addressesJson);
        if (addressesJson && addressesJson.length > 0) {
          const addressData = addressesJson.map((addr: any) => ({
            ...addr,
            entityId: newBranch.id,
            entityType: "branch",
          }));
          newAddresses = await Address.bulkCreate(addressData, {
            transaction: t,
          });
        }
      } catch (err) {
        console.error("Failed to parse addresses JSON:", err);
        return res
          .status(400)
          .json({ message: "Invalid JSON format for addresses" });
      }
    }

    const files = req.files as Express.Multer.File[];
    await Promise.all(
      files.map((file) =>
        File.create(
          {
            fileName: file.originalname,
            size: file.size,
            content: file.buffer,
            fileType: file.mimetype,
            entityType: "branch",
            entityId: newBranch.id,
          },
          { transaction: t }
        )
      )
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
    res.status(500).json({
      message: "Failed to create branch with addresses and files",
      error,
    });
  }
};
export const getBranches = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) ?? "1");
    const size = parseInt((req.query.size as string) ?? "10");

    //  const offset = (page ) * size;
    const totalRecords = await BranchMaster.count();
    const rows = await BranchMaster.findAll({
      /*  include: [
      {
        model: Address,
        as: 'Addresses', // alias automatically added by Sequelize
      },
    ], */ // e.g., (page - 1) * size
      order: [["id", "ASC"]], // optional
      limit: size, // ✅ Limit the number of rows
      offset: page, // ✅ Start from calculated offset
    });

    res.json({
      items: rows,
      total: totalRecords,
    });
  } catch (error) {
    console.error("Error fetching branch:", error);
    res.status(500).json({ error: "Failed to fetch branch" });
  }
};
export const getBranchAddress = async (req: Request, res: Response) => {
  try {
    const branchId = Number(req.params.vendorId);
    if (isNaN(branchId)) {
      return res.status(400).json({ error: "Invalid branch ID" });
    }

    // Fetch addresses
    const addresses = await Address.findAll({
      where: { entityId: branchId, entityType: "branch" },
    });

    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

export const getBranchFiles = async (req: Request, res: Response) => {
  try {
    const branchId = Number(req.params.vendorId);
    if (isNaN(branchId)) {
      return res.status(400).json({ error: "Invalid branch ID" });
    }

    // Fetch addresses
    const addresses = await File.findAll({
      where: { entityId: branchId, entityType: "branch" },
    });

    res.json(addresses);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};
export const getFileContent = async (req: Request, res: Response) => {
  try {
    const fileId = Number(req.params.fileId);
    if (isNaN(fileId)) {
      return res.status(400).json({ error: "Invalid file ID" });
    }

    const file = await File.findByPk(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    // Send as binary
    res.setHeader(
      "Content-Type",
      String(file.fileType) || "application/octet-stream"
    );
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.fileName || "file"}"`
    );
    res.send(file.content); // send buffer directly
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Failed to fetch file" });
  }
};
export const getAllBranches = async (req: Request, res: Response) => {
  try {
    const branchData = await BranchMaster.findAll({
      order: [["id", "ASC"]], // optional
      attributes: ["id", "branchName"], // ✅ Start from calculated offset
    });
    res.json({
      items: branchData,
    });
  } catch (error) {
    console.error("Error fetching branchData:", error);
    res.status(500).json({ error: "Failed to fetch branchData" });
  }
};

 import { Request, Response } from "express";
 import multer from "multer";
import sequelize from "../config/db.js";
import BankAccount from "../models/bankAccount.model.js";
import File from "../models/file.model.js";
const storage = multer.memoryStorage(); 
export const upload = multer({ storage: storage, limits: { fileSize: 100 * 1024 * 1024 } });

export const createBankAccountWithFiles = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
      let newFiles: File[] = [];
    // 1️⃣ Create account
    const newAccount = await BankAccount.create(req.body, { transaction: t });
    console.log("started with file data");
    // 2️⃣ Prepare Files
     const files = req.files as Express.Multer.File[];
  await Promise.all(
  files.map(file => File.create({
    fileName: file.originalname,
    size: file.size,
    content: file.buffer,
    fileType:file.mimetype,
    entityType: "bankaccount",
    entityId: newAccount.id
  },{transaction: t}))
);
    // ✅ Commit transaction
    await t.commit();
    // Convert Sequelize instances to plain objects


const accountJSON = { ...newAccount.toJSON(), id: newAccount.id };
   // const addressesJSON = newAddresses.map(addr => addr.toJSON());

    res.status(201).json({
      message: "Account Files created successfully",
      data: { ...accountJSON },
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating bank account with fies:", error);
    res.status(500).json({ message: "Failed to create bank account with files", error });
  }
};
export const getAccounts  = async (req: Request, res: Response) => {
  try {
  const page = parseInt((req.query.page as string) ?? '1');
  const size = parseInt((req.query.size as string) ?? '10');

  //  const offset = (page ) * size;
const totalRecords = await BankAccount.count(); // just counts rows, no data fetched
     const accounts = await BankAccount.findAll({
      include: [
        {
          model: File,
          attributes: ['id', 'fileName'], // ✅ only fetch metadata
        },
      ],
    });

    res.json({
      items: accounts,
      total: totalRecords,
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
};
export const getAccountFiles = async (req: Request, res: Response) => {
  try {
    const accountId = Number(req.params.accountId);
    if (isNaN(accountId)) {
      return res.status(400).json({ error: 'Invalid account ID' });
    }

    // Fetch addresses
    const files = await File.findAll({ where: { entityId: accountId, entityType: 'bankaccount' } });

    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};
export const deleteAccount  = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.accountId);
        const deletedCount = await BankAccount.destroy({where: { id } });
        if (deletedCount === 0) 
            return res.status(404).json({ message: "Make not found" });
        else
        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}; 
export const updateBankAccountWithFiles = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
      let newFiles: File[] = [];
  const { removedFiles, ...accountData } = req.body;
    // 1️⃣ Create account
const account = await BankAccount.findByPk(parseInt(accountData.id), { transaction: t });

    if (!account) {

      await t.rollback();
      return res.status(404).json({ message: 'Branch not found' });
    }
  await account.update(accountData, { transaction: t });
 const id = account.getDataValue('id');
    // 2️⃣ Prepare Files
     const files = req.files as Express.Multer.File[];
if (files && files.length > 0) {
  await Promise.all(
    files.map(file =>
      File.create(
        {
          fileName: file.originalname,
          size: file.size,
          content: file.buffer,
             fileType:file.mimetype,
          entityType: "bankaccount",
          entityId: id  // always safe here
        },
        { transaction: t }
      )
    )
  );
}


if (removedFiles) {
  try {
   const rmdIds = JSON.parse(removedFiles).map((id: string) => Number(id));
   if (removedFiles.length > 0) {
  await File.destroy({
    where: { id: rmdIds },
    transaction: t
  });
   }
  } catch (err) {
    res.status(201).json({
      message: "failed to parse file ids",
      data: {account},
    });  
  }
}

    // ✅ Commit transaction
    await t.commit();
    // Convert Sequelize instances to plain objects



   // const addressesJSON = newAddresses.map(addr => addr.toJSON());

    res.status(201).json({
      message: "Account and Files modified successfully",
      data: {account},
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating bank account with fies:", error);
    res.status(500).json({ message: "Failed to create bank account with files", error });
  }
};

export const getFileContent = async (req: Request, res: Response) => {
  try {
    const fileId = Number(req.params.fileId);
    if (isNaN(fileId)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }

    const file = await File.findByPk(fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    // Send as binary
    res.setHeader('Content-Type', String(file.fileType) || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${file.fileName || 'file'}"`);
    res.send(file.content); // send buffer directly

  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Failed to fetch file' });
  }
};



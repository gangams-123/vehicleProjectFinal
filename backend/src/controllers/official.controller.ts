import { Request, Response } from "express";
import sequelize from "../config/db.js";
import multer from "multer";
import bcrypt from "bcrypt";
import Official from "../models/official.model.js";
import Address from "../models/address.model.js";
import File from "../models/file.model.js";
import jwt from "jsonwebtoken";

const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});
export const createOfficialWithAddressAndFile = async (
  req: Request,
  res: Response
) => {
  console.log(req.body);
  const t = await sequelize.transaction();
  try {
    const { addresses, ...officialData } = req.body;
    let address;
    if (typeof addresses === "string") {
      address = JSON.parse(addresses);
    }

    const saltRounds = 10;
    let newAddresses: Address[] = [];
    let newFiles: File[] = [];
    const hashedPassword = await bcrypt.hash(officialData.password, saltRounds);
    const officialDatas = {
      ...officialData,
      password: hashedPassword,
    };
    const newOfficial = await Official.create(officialDatas, {
      transaction: t,
    });

    if (address && address.length > 0) {
      const addressData = address.map((addr: any) => ({
        ...addr,
        entityId: newOfficial.id,
        entityType: "official",
      }));
      newAddresses = await Address.bulkCreate(addressData, { transaction: t });
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
            entityType: "official",
            entityId: newOfficial.id,
          },
          { transaction: t }
        )
      )
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
    res.status(500).json({
      message: "Failed to create official with addresses and files",
      error,
    });
  }
};
export const checkLogin = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await Official.findOne({
      where: { email: email },
      attributes: ["id", "departmentId", "roleId", "password"], // include password for checking
    });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid email or password" });

    const payload = {
      officialId: user.id,
      deptId: user.departmentId, // adjust field names
      roleId: user.roleId,
    };
    const SECRET_KEY = "mySecretKey";
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: payload,
    });

    // 4️⃣ Sign JWT
  } catch (error) {
    console.error("Error fetching modelData:", error);
    res.status(500).json({ error: "Failed to fetch modelData" });
  }
};

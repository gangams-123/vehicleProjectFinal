 import { Request, Response } from "express";
import sequelize from "../config/db.js";
import Vendor from "../models/vendor.model.js";
import Address from "../models/address.model.js";

export const createVendorWithAddresses = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    console.log(req.body);
    const { addresses, ...vendorData } = req.body;
      let newAddresses: Address[] = [];

    // 1️⃣ Create Vendor
    const newVendor = await Vendor.create(vendorData, { transaction: t });


    // 2️⃣ Prepare Addresses
    if (addresses && addresses.length > 0) {
      const addressData = addresses.map((addr: any) => ({
        ...addr,
        entityId: newVendor.id,
        entityType: "vendor" 
      }));

    
       newAddresses =await Address.bulkCreate(addressData, { transaction: t });
    }

    // ✅ Commit transaction
    await t.commit();
    // Convert Sequelize instances to plain objects


const vendorJSON = { ...newVendor.toJSON(), id: newVendor.id };
   // const addressesJSON = newAddresses.map(addr => addr.toJSON());

    res.status(201).json({
      message: "Vendor and addresses created successfully",
      data: { ...vendorJSON },
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating vendor with addresses:", error);
    res.status(500).json({ message: "Failed to create vendor with addresses", error });
  }
};
export const getVendors  = async (req: Request, res: Response) => {
  try {
  const page = parseInt((req.query.page as string) ?? '1');
  const size = parseInt((req.query.size as string) ?? '10');

  //  const offset = (page ) * size;
const totalRecords = await Vendor.count(); // just counts rows, no data fetched
  const rows = await Vendor.findAll({
   
/*  include: [
      {
        model: Address,
        as: 'Addresses', // alias automatically added by Sequelize
      },
    ], */  // e.g., (page - 1) * size
  order: [['id', 'ASC']], // optional
   limit: size,   // ✅ Limit the number of rows
      offset: page // ✅ Start from calculated offset
});

    res.json({
      items: rows,
      total: totalRecords,
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
};
export const getVendorAddresses = async (req: Request, res: Response) => {
  try {
    const vendorId = Number(req.params.vendorId);
    if (isNaN(vendorId)) {
      return res.status(400).json({ error: 'Invalid vendor ID' });
    }

    // Fetch addresses
    const addresses = await Address.findAll({ where: { entityId: vendorId, entityType: 'vendor' } });

    res.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

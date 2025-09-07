 import { Request, Response } from "express";
import sequelize from "../config/db.js";
import Make from "../models/make.model.js";


export const createMake = async (req: Request, res: Response) => {
     const t = await sequelize.transaction();
  try {
        const makeData = req.body;
        const newMake = await Make.create(makeData, { transaction: t });
        await t.commit();     
        const makeJSON = { ...newMake.toJSON(), id: newMake.id };
        // const addressesJSON = newAddresses.map(addr => addr.toJSON());
        res.status(201).json({
            message: "Make created successfully",
            data: { ...makeJSON },
        });
    }catch (error) {
        await t.rollback();
        console.error("Error creating vendor with addresses:", error);
        res.status(500).json({ message: "Failed to create vendor with addresses", error });
    }
};
export const getMake = async (req: Request, res: Response) => {
  try {
        const page = parseInt((req.query.page as string) ?? '1');
        const size = parseInt((req.query.size as string) ?? '10');
        //  const offset = (page ) * size;
        const totalRecords = await Make.count(); // just counts rows, no data fetched
        const makeData = await Make.findAll({
            order: [['id', 'ASC']], // optional
            limit: size,   // ✅ Limit the number of rows
            offset: page ,
            attributes: ['id', 'makeName'] // ✅ Start from calculated offset
        });
       res.json({
      items: makeData,
      total: totalRecords,
    });
  } catch (error) {
    console.error('Error fetching makeData:', error);
    res.status(500).json({ error: 'Failed to fetch makeData' });
  }
};  
export const deleteMake  = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.makeId);
        const deletedCount = await Make.destroy({where: { id } });
        if (deletedCount === 0) 
            return res.status(404).json({ message: "Make not found" });
        else
        res.json({ message: "Make deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};  

export const updateMake = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID is required for update' });
    }

    // ✅ Find record by ID
    const make = await Make.findByPk(id, { transaction: t });

    if (!make) {
      await t.rollback();
      return res.status(404).json({ message: 'Make not found' });
    }

    // ✅ Update only provided fields
    await make.update(updateData, { transaction: t });

    await t.commit();

    return res.status(200).json({
      message: 'Make updated successfully',
      data: make // ✅ Return full updated object
    });
  } catch (error) {
    await t.rollback();
    console.error('Error updating make:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
}; 

export const getAllMakes = async (req: Request, res: Response) => {
  try {
        const makeData = await Make.findAll({
            order: [['id', 'ASC']], // optional
            attributes: ['id', 'makeName'] // ✅ Start from calculated offset
        });
       res.json({
      items: makeData
    });
  } catch (error) {
    console.error('Error fetching makeData:', error);
    res.status(500).json({ error: 'Failed to fetch makeData' });
  }
};  
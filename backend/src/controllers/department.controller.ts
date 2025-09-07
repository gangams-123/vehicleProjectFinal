 import { Request, Response } from "express";
import sequelize from "../config/db.js";
import Department from "../models/department.model.js";

export const createDepartment = async (req: Request, res: Response) => {
     const t = await sequelize.transaction();
  try {
        const departmentData = req.body;
        const newDepartment = await Department.create(departmentData, { transaction: t });
        await t.commit();     
        const departmentJSON = { ...newDepartment.toJSON(), id: newDepartment.id };
        // const addressesJSON = newAddresses.map(addr => addr.toJSON());
        res.status(201).json({
            message: "Department created successfully",
            data: { ...departmentJSON },
        });
    }catch (error) {
        await t.rollback();
        console.error("Error creating Department:", error);
        res.status(500).json({ message: "Failed to create Department", error });
    }
};
export const getDepartment = async (req: Request, res: Response) => {
  try {
        const page = parseInt((req.query.page as string) ?? '1');
        const size = parseInt((req.query.size as string) ?? '10');
        //  const offset = (page ) * size;
        const totalRecords = await Department.count(); // just counts rows, no data fetched
        const departmentData = await Department.findAll({
            order: [['id', 'ASC']], // optional
            limit: size,   // ✅ Limit the number of rows
            offset: page ,
            attributes: ['id', 'departmentName'] // ✅ Start from calculated offset
        });
       res.json({
      items: departmentData,
      total: totalRecords,
    });
  } catch (error) {
    console.error('Error fetching makeData:', error);
    res.status(500).json({ error: 'Failed to fetch departmentData' });
  }
};  
export const deleteDepartment  = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.makeId);
        const deletedCount = await Department.destroy({where: { id } });
        if (deletedCount === 0) 
            return res.status(404).json({ message: "Department not found" });
        else
        res.json({ message: "Department deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};  

export const updateDepartment = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID is required for update' });
    }

    // ✅ Find record by ID
    const make = await Department.findByPk(id, { transaction: t });

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

export const getAllDepartment = async (req: Request, res: Response) => {
  try {
        const makeData = await Department.findAll({
            order: [['id', 'ASC']], // optional
            attributes: ['id', 'departmentName'] // ✅ Start from calculated offset
        });
       res.json({
      items: makeData
    });
  } catch (error) {
    console.error('Error fetching makeData:', error);
    res.status(500).json({ error: 'Failed to fetch makeData' });
  }
};  
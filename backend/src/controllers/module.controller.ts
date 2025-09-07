 import { Request, Response } from "express";
import sequelize from "../config/db.js";
import Module from "../models/modules.model.js";


export const createModule = async (req: Request, res: Response) => {
     const t = await sequelize.transaction();
  try {
        const moduleData = req.body;
        const newModule = await Module.create(moduleData, { transaction: t });
        await t.commit();     
        const moduleJSON = { ...newModule.toJSON(), id: newModule.id };
        // const addressesJSON = newAddresses.map(addr => addr.toJSON());
        res.status(201).json({
            message: "Module created successfully",
            data: { ...moduleJSON },
        });
    }catch (error) {
        await t.rollback();
        console.error("Error creating Modules:", error);
        res.status(500).json({ message: "Failed to create Modules", error });
    }
};
export const getModule = async (req: Request, res: Response) => {
  try {
        const page = parseInt((req.query.page as string) ?? '1');
        const size = parseInt((req.query.size as string) ?? '10');
        //  const offset = (page ) * size;
        const totalRecords = await Module.count(); // just counts rows, no data fetched
        const moduleData = await Module.findAll({
            order: [['id', 'ASC']], // optional
            limit: size,   // ✅ Limit the number of rows
            offset: page ,
            attributes: ['id', 'moduleName'] // ✅ Start from calculated offset
        });
       res.json({
      items: moduleData,
      total: totalRecords,
    });
  } catch (error) {
    console.error('Error fetching ModuleData:', error);
    res.status(500).json({ error: 'Failed to fetch ModuleData' });
  }
};  
export const deleteModule  = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.moduleId);
        const deletedCount = await Module.destroy({where: { id } });
        if (deletedCount === 0) 
            return res.status(404).json({ message: "Module not found" });
        else
        res.json({ message: "Module deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};  

export const updateModule = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id, ...updateData } = req.body;
      console.log("in update");
    if (!id) {
      return res.status(400).json({ message: 'ID is required for update' });
    }

    // ✅ Find record by ID
    const module = await Module.findByPk(id, { transaction: t });

    if (!module) {
      await t.rollback();
      return res.status(404).json({ message: 'Module not found' });
    }

    // ✅ Update only provided fields
    await module.update(updateData, { transaction: t });

    await t.commit();

    return res.status(200).json({
      message: 'module updated successfully',
      data: module // ✅ Return full updated object
    });
  } catch (error) {
    await t.rollback();
    console.error('Error updating Module:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
}; 

export const getAllModules = async (req: Request, res: Response) => {
  try {
        const moduleData = await Module.findAll({
            order: [['id', 'ASC']], // optional
            attributes: ['id', 'moduleName'] // ✅ Start from calculated offset
        });
       res.json({
      items: moduleData
    });
  } catch (error) {
    console.error('Error fetching ModuleData:', error);
    res.status(500).json({ error: 'Failed to fetch ModuleData' });
  }
};  
 import { Request, Response } from "express";
import sequelize from "../config/db.js";
import Designation from "../models/designation.model.js";
import Department from "../models/department.model.js";


export const createDesignation = async (req: Request, res: Response) => {
     const t = await sequelize.transaction();
  try {
        const DesignationData = req.body;
        const newDesignation = await Designation.create(DesignationData, { transaction: t });
        await t.commit();     
        const DesignationJSON = { ...newDesignation.toJSON(), id: newDesignation.id };
        // const addressesJSON = newAddresses.map(addr => addr.toJSON());
        res.status(201).json({
            message: "Designation created successfully",
            data: { ...DesignationJSON },
        });
    }catch (error) {
        await t.rollback();
        console.error("Error creating Designation:", error);
        res.status(500).json({ message: "Failed to create Designation", error });
    }
};
export const getDesignation = async (req: Request, res: Response) => {
  try {
        const page = parseInt((req.query.page as string) ?? '1');
        const size = parseInt((req.query.size as string) ?? '10');
        //  const offset = (page ) * size;
        const totalRecords = await Designation.count(); // just counts rows, no data fetched
        const DesignationData = await Designation.findAll({
            order: [['id', 'ASC']], // optional
            limit: size,   // ✅ Limit the number of rows
            offset: page ,
             include: [{
                model: Department,
                attributes: ['departmentName','id']  // Only fetch makeName (optional)
            }]// ✅ Start from calculated offset
        });
       res.json({
      items: DesignationData,
      total: totalRecords,
    });
  } catch (error) {
    console.error('Error fetching modelData:', error);
    res.status(500).json({ error: 'Failed to fetch modelData' });
  }
};  
export const deleteDesignation  = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.modelId);
        const deletedCount = await Designation.destroy({where: { id } });
        if (deletedCount === 0) 
            return res.status(404).json({ message: "Model not found" });
        else
        res.json({ message: "Designation deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};  

export const updateDesignation = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID is required for update' });
    }

    // ✅ Find record by ID
    const designation = await Designation.findByPk(id, { transaction: t });

    if (!designation) {
      await t.rollback();
      return res.status(404).json({ message: 'Make not found' });
    }

    // ✅ Update only provided fields
    await designation.update(updateData, { transaction: t });

    await t.commit();

    return res.status(200).json({
      message: 'Designation updated successfully',
      data: designation // ✅ Return full updated object
    });
  } catch (error) {
    await t.rollback();
    console.error('Error updating designation:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
}; 
export const getDesignationByDept = async (req: Request, res: Response) => {
  try {
       const id = Number(req.params.departmentId);
      const designationData = await Designation.findAll({
            order: [['id', 'ASC']], // optional
            attributes: ['id', 'designationName'] ,
             where: { departmentId: id } // ✅ Start from calculated offset
        });
       res.json({
      items: designationData
    });
  }catch (error) {
    console.error('Error getting designation:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
}  
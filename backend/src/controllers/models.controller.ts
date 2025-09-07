 import { Request, Response } from "express";
import sequelize from "../config/db.js";
import Models from "../models/models.model.js";
import Make from "../models/make.model.js";


export const createModel = async (req: Request, res: Response) => {
     const t = await sequelize.transaction();
  try {
        const modelsData = req.body;
        const newModel = await Models.create(modelsData, { transaction: t });
        await t.commit();     
        const modelJSON = { ...newModel.toJSON(), id: newModel.id };
        // const addressesJSON = newAddresses.map(addr => addr.toJSON());
        res.status(201).json({
            message: "Model created successfully",
            data: { ...modelJSON },
        });
    }catch (error) {
        await t.rollback();
        console.error("Error creating Model:", error);
        res.status(500).json({ message: "Failed to create model", error });
    }
};
export const getModels = async (req: Request, res: Response) => {
  try {
        const page = parseInt((req.query.page as string) ?? '1');
        const size = parseInt((req.query.size as string) ?? '10');
        //  const offset = (page ) * size;
        const totalRecords = await Models.count(); // just counts rows, no data fetched
        const modelsData = await Models.findAll({
            order: [['id', 'ASC']], // optional
            limit: size,   // ✅ Limit the number of rows
            offset: page ,
             include: [{
                model: Make,
                attributes: ['makeName','id']  // Only fetch makeName (optional)
            }]// ✅ Start from calculated offset
        });
       res.json({
      items: modelsData,
      total: totalRecords,
    });
  } catch (error) {
    console.error('Error fetching modelData:', error);
    res.status(500).json({ error: 'Failed to fetch modelData' });
  }
};  
export const deleteModel  = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.modelId);
        const deletedCount = await Models.destroy({where: { id } });
        if (deletedCount === 0) 
            return res.status(404).json({ message: "Model not found" });
        else
        res.json({ message: "Model deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};  

export const updateModel = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID is required for update' });
    }

    // ✅ Find record by ID
    const model = await Models.findByPk(id, { transaction: t });

    if (!model) {
      await t.rollback();
      return res.status(404).json({ message: 'Make not found' });
    }

    // ✅ Update only provided fields
    await model.update(updateData, { transaction: t });

    await t.commit();

    return res.status(200).json({
      message: 'Model updated successfully',
      data: model // ✅ Return full updated object
    });
  } catch (error) {
    await t.rollback();
    console.error('Error updating make:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
}; 
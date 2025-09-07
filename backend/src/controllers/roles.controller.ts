 import { Request, Response } from "express";
import sequelize from "../config/db.js";
import Role from "../models/roles.model.js";


export const createRole = async (req: Request, res: Response) => {
     const t = await sequelize.transaction();
  try {
        const roleData = req.body;
        const newRole = await Role.create(roleData, { transaction: t });
        await t.commit();     
        const roleJSON = { ...newRole.toJSON(), id: newRole.id };
        // const addressesJSON = newAddresses.map(addr => addr.toJSON());
        res.status(201).json({
            message: "Role created successfully",
            data: { ...roleJSON },
        });
    }catch (error) {
        await t.rollback();
        console.error("Error creating Roles:", error);
        res.status(500).json({ message: "Failed to create Roles", error });
    }
};
export const getRole = async (req: Request, res: Response) => {
  try {
        const page = parseInt((req.query.page as string) ?? '1');
        const size = parseInt((req.query.size as string) ?? '10');
        //  const offset = (page ) * size;
        const totalRecords = await Role.count(); // just counts rows, no data fetched
        const roleData = await Role.findAll({
            order: [['id', 'ASC']], // optional
            limit: size,   // ✅ Limit the number of rows
            offset: page ,
            attributes: ['id', 'roleName'] // ✅ Start from calculated offset
        });
       res.json({
      items: roleData,
      total: totalRecords,
    });
  } catch (error) {
    console.error('Error fetching RoleData:', error);
    res.status(500).json({ error: 'Failed to fetch RoleData' });
  }
};  
export const deleteRole  = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.roleId);
        const deletedCount = await Role.destroy({where: { id } });
        if (deletedCount === 0) 
            return res.status(404).json({ message: "Role not found" });
        else
        res.json({ message: "Role deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};  

export const updateRole = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID is required for update' });
    }

    // ✅ Find record by ID
    const role = await Role.findByPk(id, { transaction: t });

    if (!role) {
      await t.rollback();
      return res.status(404).json({ message: 'Role not found' });
    }

    // ✅ Update only provided fields
    await role.update(updateData, { transaction: t });

    await t.commit();

    return res.status(200).json({
      message: 'role updated successfully',
      data: role // ✅ Return full updated object
    });
  } catch (error) {
    await t.rollback();
    console.error('Error updating role:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
}; 

export const getAllRoles = async (req: Request, res: Response) => {
  try {
        const roleData = await Role.findAll({
            order: [['id', 'ASC']], // optional
            attributes: ['id', 'roleName'] // ✅ Start from calculated offset
        });
       res.json({
      items: roleData
    });
  } catch (error) {
    console.error('Error fetching roleData:', error);
    res.status(500).json({ error: 'Failed to fetch roleData' });
  }
};  
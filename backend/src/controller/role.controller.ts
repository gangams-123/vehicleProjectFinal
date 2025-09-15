// src/controller/role.controller.ts
import { Request, Response } from "express";
import { RoleService } from "../service/role.service.js";

export class RoleController {
  constructor(private roleService: RoleService) {}

  createRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const role = await this.roleService.createRole(req.body);
      res.status(201).json(role);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getRoles = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data, total } = await this.roleService.getRolesPaginated(
        page,
        limit
      );
      res.json({ page, limit, total, data });
    } catch (error: any) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getAllRoles = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.roleService.getAllRoles();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getRoleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const role = await this.roleService.getRoleById(id);
      if (!role) {
        res.status(404).json({ error: "Role not found" });
        return;
      }
      res.json(role);
    } catch (error: any) {
      res.status(400).json({ error: "Invalid ID" });
    }
  };

  updateRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const updatedRole = await this.roleService.updateRole(id, req.body);
      if (!updatedRole) {
        res.status(404).json({ error: "Role not found" });
        return;
      }
      res.json(updatedRole);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.roleService.deleteRole(id);
      if (result.affected === 0) {
        res.status(404).json({ error: "Role not found" });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}

import { Request, Response } from "express";
import { DepartmentService } from "../service/department.service.js";

export class DepartmentController {
  private departmentService: DepartmentService;

  constructor(departmentService: DepartmentService) {
    this.departmentService = departmentService;
  }

  createDepartment = async (req: Request, res: Response) => {
    try {
      const department = await this.departmentService.createDepartment(
        req.body
      );
      res.status(201).json(department);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getDepartments = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data, total } =
        await this.departmentService.getDepartmentsPaginated(page, limit);

      res.json({ page, limit, total, data });
    } catch (error: any) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getDepartmentById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const department = await this.departmentService.getDepartmentById(id);
      if (!department) {
        return res.status(404).json({ error: "Department not found" });
      }
      res.json(department);
    } catch (error: any) {
      res.status(400).json({ error: "Invalid ID" });
    }
  };

  updateDepartment = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const department = await this.departmentService.updateDepartment(
        id,
        req.body
      );
      if (!department) {
        return res.status(404).json({ error: "Department not found" });
      }
      res.status(200).json({
        message: "Department updated successfully",
        data: department,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteDepartment = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.departmentService.deleteDepartment(id);
      if (result.affected === 0) {
        return res.status(404).json({ error: "Department not found" });
      }
      res.status(204).json({ message: "Department deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
  getAllDepartments = async (req: Request, res: Response) => {
    try {
      const { data } = await this.departmentService.getDepartmentsPaginated();

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

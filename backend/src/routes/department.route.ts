import { Router } from "express";
import {createDepartment,updateDepartment,deleteDepartment,getDepartment,getAllDepartment} from "../controllers/department.controller.js"
const departmentRouter = Router();

departmentRouter.post("/", createDepartment);
departmentRouter.get("/", getDepartment);
departmentRouter.delete("/:makeId", deleteDepartment);
departmentRouter.put("/",updateDepartment);
departmentRouter.get("/all", getAllDepartment);
export default departmentRouter;

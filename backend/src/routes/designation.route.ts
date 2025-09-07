import { Router } from "express";
import {createDesignation,updateDesignation,getDesignation,deleteDesignation,getDesignationByDept} from "../controllers/designation.controller.js"
const designationRouter = Router();

designationRouter.post("/", createDesignation);
designationRouter.get("/", getDesignation);
designationRouter.delete("/:designationId", deleteDesignation);
designationRouter.put("/",updateDesignation);
designationRouter.get("/:departmentId/departments", getDesignationByDept);
export default designationRouter;

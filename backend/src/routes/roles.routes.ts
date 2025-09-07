import { Router } from "express";
import { createRole,deleteRole,getAllRoles,getRole,updateRole} from "../controllers/roles.controller.js";
const roleRouter = Router();

roleRouter.post("/", createRole);
roleRouter.get("/", getRole);
roleRouter.delete("/:roleId", deleteRole);
roleRouter.put("/",updateRole);
roleRouter.get("/all", getAllRoles);
export default roleRouter;

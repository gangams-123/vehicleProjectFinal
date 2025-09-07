import { Router } from "express";
import {createModule,getAllModules,getModule,deleteModule,updateModule } from "../controllers/module.controller.js";
const moduleRouter = Router();

moduleRouter.post("/", createModule);
moduleRouter.get("/", getModule);
moduleRouter.delete("/:moduleId", deleteModule);
moduleRouter.put("/",updateModule);
moduleRouter.get("/all", getAllModules);
export default moduleRouter;

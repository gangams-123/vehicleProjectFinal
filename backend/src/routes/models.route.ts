import { Router } from "express";
import { createModel,getModels,deleteModel,updateModel} from "../controllers/models.controller.js"
const modelRouter = Router();

modelRouter.post("/", createModel);
modelRouter.get("/", getModels);
modelRouter.delete("/:modelId", deleteModel);
modelRouter.put("/",updateModel);

export default modelRouter;

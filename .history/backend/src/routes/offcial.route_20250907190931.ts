import { Router } from "express";
import { create} from "../controllers/official.controller.js"
const makeRouter = Router();

makeRouter.post("/", createMake);
makeRouter.get("/", getMake);
makeRouter.delete("/:makeId", deleteMake);
makeRouter.put("/",updateMake);
makeRouter.get("/all", getAllMakes);
export default makeRouter;

import { Router } from "express";
import { createOfficialWithAddressAndFile} from "../controllers/official.controller.js"
const officialRouter = Router();

makeRouter.post("/", createMake);
makeRouter.get("/", getMake);
makeRouter.delete("/:makeId", deleteMake);
makeRouter.put("/",updateMake);
makeRouter.get("/all", getAllMakes);
export default makeRouter;

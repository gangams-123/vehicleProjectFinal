import { Router } from "express";
import { createOfficialWithAddressAndFile} from "../controllers/official.controller.js"
const officialRouter = Router();

officialRouter.post("/", createOfficialWithAddressAndFile);
export default officialRouter;

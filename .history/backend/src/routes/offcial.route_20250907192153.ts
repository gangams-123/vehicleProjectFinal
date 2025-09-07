import { Router } from "express";
import { createOfficialWithAddressAndFile,upload} from "../controllers/official.controller.js"
const officialRouter = Router();

officialRouter.post("/", upload.array("files", 10), createOfficialWithAddressAndFile);
export default officialRouter;

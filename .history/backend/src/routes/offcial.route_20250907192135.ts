import { Router } from "express";
import { createOfficialWithAddressAndFile,upload} from "../controllers/official.controller.js"
const officialRouter = Router();

accountRouter.post("/", upload.array("files", 10), createBankAccountWithFiles);
export default officialRouter;

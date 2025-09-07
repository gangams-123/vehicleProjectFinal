import { Router } from "express";
import { createBranchWithAddressAndFile,getBranches,getAllBranches,upload,getFileContent,getBranchAddress,getBranchFiles} from "../controllers/branchmaster.controller.js"

const branchRouter = Router();
branchRouter.get("/", getBranches);
branchRouter.get("/:branchId/addresses", getBranchAddress);
branchRouter.get("/:branchId/files", getBranchFiles);
branchRouter.post("/", upload.array("files", 10), createBranchWithAddressAndFile);
branchRouter.get("/file/:fileId", getFileContent);
branchRouter.get("/all",getAllBranches);
export default branchRouter;

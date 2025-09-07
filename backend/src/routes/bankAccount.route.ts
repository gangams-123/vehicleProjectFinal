import { Router } from "express";
import { createBankAccountWithFiles,getAccounts,getAccountFiles,upload,deleteAccount,updateBankAccountWithFiles,getFileContent} from "../controllers/bankAccount.controller.js"
const accountRouter = Router();

//accountRouter.post("/", createBankAccountWithFiles);
accountRouter.post("/", upload.array("files", 10), createBankAccountWithFiles);
accountRouter.get("/", getAccounts);
accountRouter.get("/:accountId/files", getAccountFiles);
accountRouter.put("/", upload.array("files", 10), updateBankAccountWithFiles);
accountRouter.delete("/:accountId",deleteAccount);
accountRouter.get("/file/:fileId", getFileContent);
export default accountRouter;

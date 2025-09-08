import { Router } from "express";
import {
  createOfficialWithAddressAndFile,
  upload,
  checkLogin,
} from "../controllers/official.controller.js";
const officialRouter = Router();

officialRouter.post(
  "/",
  upload.array("files", 10),
  createOfficialWithAddressAndFile
);
officialRouter.post("/login", checkLogin);
export default officialRouter;

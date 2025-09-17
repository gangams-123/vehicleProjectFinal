import express, { Application } from "express";
import cors from "cors";
import { createWorkFlowRoutes } from "./routes/workFlowRoutes.js";
import { createBranchRoutes } from "./routes/branch.routes.js";
import { createDepartmentRoutes } from "./routes/department.routes.js";
import { createMakeRoutes } from "./routes/make.routes.js";
import { createAuthRoutes } from "./routes/auth.routes.js";
import { createDesignationRoutes } from "./routes/designation.routes.js";
import { createRoleRoutes } from "./routes/role.routes.js";
import { createExpenseRoutes } from "./routes/expense.routes.js";
import { timeStamp } from "console";
import { createOfficialRoutes } from "./routes/official.routes.js";
export class App {
  public app: Application;

  constructor(private port: number) {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.start();
  }

  private initializeMiddlewares(): void {
    this.app.use(
      cors({
        origin: "http://localhost:4200", // frontend URL
        credentials: true, // allow cookies / auth headers
      })
    );

    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.use(createWorkFlowRoutes());
    this.app.use(createBranchRoutes());
    this.app.use(createDepartmentRoutes());
    this.app.use(createMakeRoutes());
    this.app.use(createAuthRoutes());
    this.app.use(createDesignationRoutes());
    this.app.use(createRoleRoutes());
    this.app.use(createExpenseRoutes());
    this.app.use(createOfficialRoutes());
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(` Server running on http://localhost:${this.port}`);
    });
  }
}

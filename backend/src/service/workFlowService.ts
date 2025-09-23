// src/service/workflow.service.ts
import { Repository, DataSource } from "typeorm";
import { WorkFlowMain } from "../entity/workFlowMain.js";
import { WorkFlowChild } from "../entity/WorkFlowChild.js";

export class WorkFlowService {
  private mainRepo: Repository<WorkFlowMain>;
  private childRepo: Repository<WorkFlowChild>;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.mainRepo = dataSource.getRepository(WorkFlowMain);
    this.childRepo = dataSource.getRepository(WorkFlowChild);
  }

  async createWorkFlowWithChild(data: any): Promise<WorkFlowMain> {
    const { workFlows, ...mainData } = data;

    return await this.dataSource.transaction(async (manager) => {
      const newMain = manager.create(WorkFlowMain, mainData);
      const savedMain = await manager.save(WorkFlowMain, newMain);
      if (workFlows?.length) {
        const childEntities = workFlows.map((child: any) =>
          manager.create(WorkFlowChild, {
            status: child.status,
            stepOrder: child.stepOrder,
            workFlowMain: savedMain,
            role: { id: child.roleId },
          })
        );

        await manager.save(WorkFlowChild, childEntities);
      }

      return savedMain;
    });
  }

  async getWorkFlows({
    page = 1,
    size = 10,
    status = "active",
  }): Promise<{ items: WorkFlowMain[]; total: number }> {
    const [items, total] = await this.mainRepo.findAndCount({
      where: { status },
      relations: {
        WorkFlowChild: { role: true },
      },
      order: { id: "ASC" },
      skip: (page - 1) * size,
      take: size,
    });

    return { items, total };
  }

  async checkWorkFlowActiveExists(module: string, status: string) {
    return await this.mainRepo.findOne({ where: { module, status } });
  }

  async changeStatus(id: number, status: string): Promise<number> {
    const result = await this.mainRepo.update(id, { status });
    return result.affected ?? 0;
  }

  async getWorkflowByStatusByModule(module: string, status: string) {
    const workflow = await this.mainRepo.findOne({
      where: { module, status },
      relations: {
        WorkFlowChild: {
          role: true,
        },
      },
    });

    if (!workflow) return null;

    const grouped: Record<
      string,
      { roleId: string; workflowId: number; stepOrder: number }[]
    > = {};
    for (const child of workflow.WorkFlowChild || []) {
      if (!grouped[child.status]) {
        grouped[child.status] = [];
      }
      grouped[child.status].push({
        roleId: child.role.id.toString(),
        workflowId: workflow.id,
        stepOrder: child.stepOrder!,
      });
    }

    return grouped;
  }
}

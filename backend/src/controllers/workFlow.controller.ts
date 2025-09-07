 import { Request, Response } from "express";
import sequelize from "../config/db.js";
import WorkFlowChild from "../models/workFlowChild.model.js";
import WorkFlowMain from "../models/workFlowMain.model.js";
import Roles from "../models/roles.model.js";

export const createWorkFlowWithChild = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    console.log(req.body);
    const { workFlows, ...workFlowData } = req.body;
      let newWorkFlowChild: WorkFlowChild[] = [];

    // 1️⃣ Create Vendor
    const newWorkFlow = await WorkFlowMain.create(workFlowData, { transaction: t });


    // 2️⃣ Prepare Addresses
    if (workFlows && workFlows.length > 0) {
      const workFlowChildData = workFlows.map((wf: any) => ({
        ...wf,
        mainId: newWorkFlow.id
      }));

    
       newWorkFlowChild =await WorkFlowChild.bulkCreate(workFlowChildData, { transaction: t });
    }

    // ✅ Commit transaction
    await t.commit();
    // Convert Sequelize instances to plain objects


const workflowJSON = { ...newWorkFlow.toJSON(), id: newWorkFlow.id };
   // const addressesJSON = newAddresses.map(addr => addr.toJSON());

    res.status(201).json({
      message: "WorkFlow and child created successfully",
      data: { ...workflowJSON },
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating workflow with child:", error);
    res.status(500).json({ message: "Failed to create workflow with child", error });
  }
};
export const getWorkFlows  = async (req: Request, res: Response) => {
  try {
  const page = parseInt((req.query.page as string) ?? '1');
  const size = parseInt((req.query.size as string) ?? '10');
   const status = req.query.status?.toString() || 'active';
  //  const offset = (page ) * size;
const totalRecords = await WorkFlowMain.count({
  where: { status }
});
// just counts rows, no data fetched
 const rows = await WorkFlowMain.findAll({
      where: {
        status: status, // ✅ Filter main table by status
      },
      include: [
        {
          model: WorkFlowChild,
          required: false,
          include: [
            {
              model: Roles,
              attributes: ['roleName'],
            },
          ],
        },
      ],
      order: [['id', 'ASC']],
      limit: size,
      offset: page,
    });

    res.json({
      items: rows,
      total: totalRecords,
    });
  } catch (error) {
    console.error('Error fetching workFlows:', error);
    res.status(500).json({ error: 'Failed to fetch workFlows' });
  }
};
export const getWorkFlowByModule  = async (req: Request, res: Response) => {
    try {
       const moduleName = req.params.module;
       const status=req.params.status;
       const existingWorkflow = await WorkFlowMain.findOne({where: {module: moduleName,status:status}});
       if (existingWorkflow) {
          return res.status(200).json({
            message: 'Workflow already exists',
            data: existingWorkflow
          });
        } else {
            return res.status(404).json({
              message: 'No workflow found for this module'
            });
        }
    } catch (error) {
        console.error('Error checking workflowwithmodule:', error);
        return res.status(404).json({ message: 'some error occured while finding not found' });
      }
};

export const changeStatus  = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.mainId);
        console.log(id);
        const status=req.body.status;
        console.log('Request body received:', status);
       const [affectedCount] = await WorkFlowMain.update(
  { status: status },
  { where: { id: id } }
);

console.log(affectedCount); // e.g., 1


if(affectedCount===0)
return res.status(404).json({ message: "some problem did not change the status" });
else
    res.json({ message: "changed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
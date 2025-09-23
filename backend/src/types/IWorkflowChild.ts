export interface IWorkFlowChild {
  id: number;
  status: string;
  role?: any; // Replace `any` with actual Role type if available
  stepOrder?: number;
}

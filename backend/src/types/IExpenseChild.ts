import { Official } from "../entity/official";

export interface IExpenseChild {
  id: number;
  status: string;
  remarks: string;
  official: Official;
}

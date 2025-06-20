import { cashierRouter } from "./cashier.controller";
import { CashierModel } from "./cashier.schema";
import { CashierService } from "./cashier.service";

export class CashierModule {
  public router = cashierRouter;
  public service = new CashierService();
  public model = CashierModel;
}
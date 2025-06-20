import { receiptRouter } from "./receipts.controller";
import { ReceiptModel } from "./receipts.schema";
import { ReceiptService } from "./receipts.service";

export class ReceiptModule {
  public router = receiptRouter;
  public service = new ReceiptService();
  public model = ReceiptModel;
}
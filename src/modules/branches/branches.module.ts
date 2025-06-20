import { branchRouter } from "./branches.controller";
import { BranchModel } from "./branches.schema";
import { BranchService } from "./branches.service";

export class BranchModule {
  public router = branchRouter;
  public service = new BranchService();
  public model = BranchModel;
}
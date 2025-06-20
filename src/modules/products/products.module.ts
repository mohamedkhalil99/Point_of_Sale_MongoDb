import { productRouter } from "./products.controller";
import { ProductModel } from "./products.schema";
import { ProductService } from "./products.service";

export class ProductModule {
  public router = productRouter;
  public service = new ProductService();
  public model = ProductModel;
}
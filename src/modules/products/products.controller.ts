import { Router, Request, Response } from 'express';
import { ProductService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './products.dto';
import { authenticate, authorize } from '../../guards/guards.middleware';

const productRouter = Router();
const productService = new ProductService();

// Desc: Admin can create a new product
// Route: POST /products
// Access: Private (admin only)
productRouter.post('/', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const dto: CreateProductDto = req.body;
    const newProduct = await productService.create(dto);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can get all products with optional (with filters & pagination)
// Route: GET /products
// Access: Private (admin only)
productRouter.get('/', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const { name, category, minPrice, maxPrice, page = '1', limit = '10' } = req.query;

    const filters = {
      ...(name ? { name: { $regex: name, $options: 'i' } } : {}),
      ...(category ? { category: { $regex: category, $options: 'i' } } : {}),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { $gte: Number(minPrice) } : {}),
              ...(maxPrice ? { $lte: Number(maxPrice) } : {})
            }
          }
        : {})
    };

    const result = await productService.findAllWithPagination(filters, Number(page), Number(limit));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can get one product by ID
// Route: GET /products/:id
// Access: Private (admin only)
productRouter.get('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await productService.findOne(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can update product by ID
// Route: PATCH /products/:id
// Access: Private (admin only)
productRouter.patch('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const dto: UpdateProductDto = req.body;
    const updated = await productService.update(req.params.id, dto);
    if (!updated) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Desc: Admin can delete product by ID
// Route: DELETE /products/:id
// Access: Private (admin only)
productRouter.delete('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await productService.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

export { productRouter };
import { Router, Request, Response } from 'express';
import { ReceiptService } from './receipts.service';
import { authenticate, authorize } from '../../guards/guards.middleware';
import { CreateReceiptDto } from './receipts.dto';

const receiptRouter = Router();
const receiptService = new ReceiptService();

// Desc: Cashier can create a new Receipt
// Route: POST /receipts
// Access: Private (cashier only)
receiptRouter.post('/', authenticate, authorize(['cashier']), async (req: Request, res: Response) => {
  try {
    const dto: CreateReceiptDto = req.body;
    const userId = (req as any).user._id;
    const receipt = await receiptService.create(userId, dto);
    res.status(201).json(receipt);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Failed to create receipt', error: errorMessage });
  }
});

// Desc: Admin can Get a all receipts (with filters & pagination)
// Route: GET /receipts
// Access: Private (Admin only)
receiptRouter.get('/', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
  try {
    const {
      cashierId,
      branchId,
      dateFrom,
      dateTo,
      minTotal,
      maxTotal,
      productName,
      category,
      page = '1',
      limit = '10',
    } = req.query;

    const filters = {
      ...(cashierId ? { cashier: cashierId } : {}),
      ...(branchId ? { branch: branchId } : {}),
      ...(dateFrom || dateTo
        ? {
            createdAt: {
              ...(dateFrom ? { $gte: new Date(dateFrom as string) } : {}),
              ...(dateTo ? { $lte: new Date(dateTo as string) } : {}),
            },
          }
        : {}),
      ...(minTotal || maxTotal
        ? {
            totalPrice: {
              ...(minTotal ? { $gte: Number(minTotal) } : {}),
              ...(maxTotal ? { $lte: Number(maxTotal) } : {}),
            },
          }
        : {}),
      productName,
      category,
    };

    const result = await receiptService.findAllWithFilters(filters, Number(page), Number(limit));
    res.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Failed to retrieve receipts', error: errorMessage });
  }
});

export { receiptRouter };
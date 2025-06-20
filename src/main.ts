import 'reflect-metadata';
import express from 'express';
import { connectDB } from './database';
import { AdminModule } from './modules/admins/admins.module';
import { CashierModule } from './modules/cashiers/cashier.module';
import { AuthModule } from './modules/auth/auth.module';
import { BranchModule } from './modules/branches/branches.module';
import { ProductModule } from './modules/products/products.module';
import { ReceiptModule } from './modules/receipts/receipts.module';

const app = express();
app.use(express.json());

//Routers
const adminModule = new AdminModule();
const cashierModule = new CashierModule();
const authModule = AuthModule;
const branchModule = new BranchModule();
const productModule = new ProductModule();
const receiptModule = new ReceiptModule();

app.use('/admins', adminModule.router);
app.use('/cashiers', cashierModule.router);
app.use('/auth', authModule.router);
app.use('/branches', branchModule.router);
app.use('/products', productModule.router);
app.use('/receipts', receiptModule.router);

//Start server after connecting to MongoDB
connectDB().then(async () => {
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
});
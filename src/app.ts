import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';
import orderRoutes from './handlers/orders';
 
export const app: express.Application = express();
// enable cors
const corsOption = {
    optionsSuccessStatus: 200
};
app.use(bodyParser.json());
app.use(cors(corsOption));
orderRoutes(app);
productRoutes(app);
userRoutes(app);
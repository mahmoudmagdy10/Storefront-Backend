import express,{Response,Request} from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';
import orderRoutes from './handlers/orders';


const app: express.Application = express();
const address: string = "0.0.0.0:3000";
const port = 3000;

// enable cors
const corsOption = {
    optionsSuccessStatus: 200
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(corsOption));
orderRoutes(app);
productRoutes(app);
userRoutes(app);

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
});

export const server = app.listen(port, function () {
    console.log(`starting app on: ${address}`)
});
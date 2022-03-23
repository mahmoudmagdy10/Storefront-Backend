import express, { Request, Response } from 'express';
import { Products, productStore } from '../models/product';
import auth from '../middleware/auth';


const store = new productStore();

const index = async (_req: Request, res: Response) => {
    try{
        const products = await store.index();
        res.json(products);
    } catch(err){
        res.status(400);
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try{
        const product = await store.show(parseInt(req.params.id));
        return res.json({
            status:"success",
            data:{...product},
            message:"Products showed successfully"
          });
    } catch(err){
        res.status(400);
        res.json(err);
}

};
const create = async (req: Request, res: Response) => {
    try {
      const p:Products = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
      };
      const newProduct = await store.create(p);
      return res.json({
        status:"success",
        data:{...newProduct},
        message:"User created successfully"
      });
  
    } catch(err) {
      res.status(400);
      res.json(err);
  }
  }

const destroy = async (req: Request, res: Response) => {
    try{
        const deleted = await store.delete(parseInt(req.params.id));
        return res.json({
            status:"success",
            data:{...deleted},
            message:"Product deleted successfully"
          });
    } catch(err){
        res.status(400)
        res.json(err)
    }
}

const productRoutes = (app: express.Application) => {
  app.get('/api/products', index)
  app.get('/api/products/:id',show)
  app.post('/api/products',auth, create)
  app.delete('/api/products/:id',auth, destroy)
}

export default productRoutes
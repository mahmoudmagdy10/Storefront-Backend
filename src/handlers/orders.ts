import express, { Request, Response } from 'express';
import { Order, Orders } from '../models/order';
import  jwt  from 'jsonwebtoken';
import auth from '../middleware/auth';

const store = new Orders();

const getOrder = async (req: Request, res: Response) => {
  try{
    const orders = await store.getOrder(parseInt(req.params.user_id));
    return res.json({
      status:"success",
      data:{...orders},
      message:"Order getorder successfully"
    });
  } catch(err){
    res.status(400)
    res.json(err)
  }
};

const currentOrderByUserId = async (req: Request, res: Response) => {
  try{
    const orders = await store.currentOrderByUserId(parseInt(req.params.user_id));
    return res.json({
      status:"success",
      data:{...orders},
      message:"Current order showed successfully"
    });
  } catch(err){
    res.status(400)
    res.json(err)
  }
};

const activeOrderByUserId = async (req: Request, res: Response) => {
  try{
    const orders = await store.getActiveOrders(parseInt(req.params.user_id));
    return res.json({
      status:"success",
      data:{...orders},
      message:"Active order showed successfully"
    });
  } catch(err){
    res.status(400)
    res.json(err)
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const order:Order = {
      product_id: req.body.product_id,
      user_id: req.body.user_id,
      quantity: req.body.quantity,
      status: req.body.status,
    };
    
    const newOrder= await store.create(order);
    return res.json({
      status:"success",
      data:{...newOrder},
      message:"Order created successfully"
    });

  } catch(err) {
    res.status(400);
    res.json(err);
  }
};
  
const destroy = async (req: Request, res: Response) => {
  try{
      const deleted = await store.delete(parseInt(req.params.id));
      return res.json({
          status:"success",
          data:{...deleted},
          message:"Order deleted successfully"
        });
  } catch(err){
      res.status(400)
      res.json(err)
  }
}

const orderRoutes = (app: express.Application) => {
  app.get('/api/orders/:user_id', auth,getOrder);
  app.get('/api/orders/current/:user_id', auth,currentOrderByUserId);
  app.get('/api/orders/active/:user_id', auth,activeOrderByUserId);
  app.post('/api/orders', auth,create);
  app.delete('/api/orders/delete/:id',auth, destroy);
};

export default orderRoutes;
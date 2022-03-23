import express, { Request, Response } from 'express'
import { User, Users } from '../models/user'
import  jwt  from 'jsonwebtoken';
import auth from '../middleware/auth';


const store = new Users();
const authenticate = async (req: Request, res: Response) => {
  try {
    const { firstname,lastname, password } = req.body
    const u = await store.authenticate(firstname,lastname,password)
    const token = jwt.sign({ u }, process.env.TOKEN_SECRET as string);
    if(!u){
      return res.status(404).json({
        status:"error",
        message:"Username and password do not matched , plz try again"
      });
    } else{
      return res.json({
        status:"success",
        data:{...u,token},
        message:"User authenticated successfully"
      });
    }
  } catch(error) {
      res.status(401)
      res.json({ error })
  }
}

const index = async (_req: Request, res: Response) => {
  try{
    const users = await store.index();
    return res.json(users);
  } catch(err){
    res.status(400)
    res.json(err)
  }
}

const show = async (req: Request, res: Response) => {
  try{
    const user = await store.show(parseInt(req.params.id));
    return res.json({
      status:"success",
      data:{...user},
      message:"User created successfully"
    });
  } catch(err){
    res.status(400)
    res.json(err)
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const u:User = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    };
    const newUser = await store.create(u);
    return res.json({
      status:"success",
      data:{...newUser},
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
      message:"User created successfully"
    });
  } catch(err){
    res.status(400)
    res.json(err)
  }
}

const userRoutes = (app: express.Application) => {
  app.get('/api/users',auth, index);
  app.post('/api/users/authenticate', authenticate);
  app.get('/api/users/:id', auth,show);
  app.post('/api/users',create);
  app.delete('/api/users/:id', auth,destroy);
};

export default userRoutes;
import jsonwebtoken from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const error: Error = new Error('Login Error, Please login again');
const authToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if(authorizationHeader){
      const bearer = authorizationHeader.split(' ')[0].toLowerCase()
      const token: string = authorizationHeader ? authorizationHeader.split(' ')[1] : '';
      if(token && bearer === 'bearer'){
        const decoded: string | object = jsonwebtoken.verify(token, process.env.TOKEN_SECRET as string);
        if(decoded){
          next()
        } else{
          res.status(401);
          res.json(error);
          next(error);
        }
      } else{
        res.status(401);
        res.json(error);
        next(error);
      }

    }else{
      res.status(401);
      res.json(error);
      next(error);
    }
  } catch (err) {
    res.status(401);
    res.json(err);
    next(err);
  }
};
export default authToken;
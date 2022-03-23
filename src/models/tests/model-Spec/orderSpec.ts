import {Order,Orders } from '../../order';
import {User , Users} from '../../user';
import {Products,productStore} from '../../product';
import db from '../../../database';

const orderModel = new Orders();
const userModel = new Users();
const productModel = new productStore();


describe('Order Model', () => {
  describe('Test methods exists',()=>{
    it('should have an getCurrentOrderByUserId  method', () => {
      expect(orderModel.index).toBeDefined();
    });
    it('should have an create  method', () => {
      expect(orderModel.create).toBeDefined();
    });
    it('should have a currentOrderByUserId method', () => {
      expect(orderModel.currentOrderByUserId).toBeDefined();
    });
    it('should have a delete method', () => {
      expect(orderModel.delete).toBeDefined();
    });
    it('should have a getActiveOrders method', () => {
      expect(orderModel.getActiveOrders).toBeDefined();
    }); 
  });
  describe('Test product logics',() => {
    const user ={
      firstname: 'mahmoud',
      lastname: 'magdy',
      password: 'mypassword123',
    } as User;

    const product ={
      name: 'iPhone',
      price: 700,
      category:'phone',
    } as Products;

    const order ={
      quantity: 100,
      status:'active', 
    } as Order;

    beforeAll(async()=>{
      const createUser = await userModel.create(user);
      user.id = createUser.id;

      const createProduct = await productModel.create(product);
      product.id = createProduct.id;

      const createOrder = await orderModel.create(order);
      order.id = createOrder.id;
    });

    afterAll(async () => {
      const connection = await db.connect();
      const sql1 ='DELETE FROM users';
      const sql2 ='DELETE FROM products';
      const sql3 ='DELETE FROM orders';
      await connection.query(sql1);
      await connection.query(sql2);
      await connection.query(sql3);
      connection.release();
    });

    it('create method should add a order', async () => {
      const result = await orderModel.create({
        quantity: 20,
        status:'active',
        product_id: product.id,
        user_id: user.id,
      });
      expect(result).toEqual({
          id: result.id,
          product_id: product.id,
          user_id: user.id,
          quantity: 20,
          status:'active', 
      });
    });

    it('should return active orders of user using getActiveOrders method', async () => {
      const result = await orderModel.getActiveOrders(user.id as number);
      expect(result).toEqual({
        id: result.id,
        product_id: product.id,
        user_id: user.id,
        quantity: result.quantity,
        status:'active', 
      });
    });

    it('index method should return a list of users', async () => {
      const result = await orderModel.index();
      expect(result.length).toBe(2);

    });

    it('getOne method should return a list of orders', async () => {
      const result = await orderModel.getOrder(user.id as number);
      expect(result).toEqual({
        id: result.id,
        product_id: product.id,
        user_id: user.id,
        quantity: result.quantity,
        status:'active', 
      });
    });

    it('delete method should remove the order', async () => {
      const deleted = await orderModel.delete(order.id as number);
  
      expect(deleted.id).toBe(order.id)
      
    });     
  });
});

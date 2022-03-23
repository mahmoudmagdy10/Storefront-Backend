import {Orders ,Order} from '../../order';
import supertest from 'supertest';
import { server } from '../../../server';
import {productStore,Products } from '../../product';
import {Users ,User} from '../../user';
import db from '../../../database';



const request: supertest.SuperTest<supertest.Test> = supertest(server);
const orderModel = new Orders();
const userModel = new Users();
const productModel = new productStore();

let token: string ='';

describe('Test endpoint Orders responses', ():void => {
  const product ={
    name: 'iPhone',
    price: 700,
    category:'phone',
  } as Products;

  const user ={
    firstname: 'mahmoud',
    lastname: 'magdy',
    password: 'mypassword123',
  } as User;

  const order ={
    product_id:product.id,
    user_id:user.id,
    quantity: 10,
    status:'active', 
  } as Order;

  beforeAll(async () => {
    const createProduct = await productModel.create(product);
    product.id = createProduct.id;

    const createUser = await userModel.create(user);
    user.id = createUser.id;

    const createOrder = await orderModel.create(order);
    order.id = createOrder.id;

  });

  afterAll(async() => {
    const connection = await db.connect();
    const sql1 ='DELETE FROM products';
    const sql2 ='DELETE FROM users';
    const sql3 ='DELETE FROM orders';
    await connection.query(sql1);
    await connection.query(sql2);
    await connection.query(sql3);
    connection.release();
  });

  describe('Test Authentication methods ', () => {

    it('should be able to authenticate to get token', async () => {
      const res = await request
        .post('/api/users/authenticate')
        .set('Content-type', 'application/json')
        .send({
          firstname: 'mahmoud',
          lastname: 'magdy',
          password: 'mypassword123',
        })
      expect(res.status).toBe(200)
      const { id, firstname,lastname, token: userToken } = res.body.data
      expect(id).toBe(user.id)
      expect(firstname).toBe('mahmoud')
      expect(lastname).toBe('magdy')
      token = userToken
    })

    it('should be failed to authenticate with wrong email', async () => {
      const res = await request
        .post('/api/users/authenticate')
        .set('Content-type', 'application/json')
        .send({
          firstname: 'tests',
          lastname: 'users',
          password: 'test123456',
        })
      expect(res.status).toBe(404)
    })
  });

  describe('Test CRUD API Endpoint Methods ', () => {

    it('should create new order', async () => {
      const res = await request
        .post('/api/orders/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          product_id:product.id,
          user_id:user.id,
          quantity: 200,
          status: 'active',
        } as Order);

      expect(res.status).toBe(200)
      const { quantity,status,product_id,user_id } = res.body.data
      expect(quantity).toBe(200)
      expect(status).toBe('active')
      expect(product_id).toBe(product.id)
      expect(user_id).toBe(user.id)
    })

    it('show all orders by user id' ,async () => {
      const response = await request.
      get(`/api/orders/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type','application.json');

      expect(response.status).toBe(200);
      const{quantity,status,product_id,user_id} = response.body.data;
      expect(product_id).toBe(product.id)
      expect(user_id).toBe(user.id)
      expect(quantity).toBe(200)
      expect(status).toBe('active')
    });

    it('(currentOrderByUserId) show specific order by user id' ,async () => {
      const response: supertest.Response = await request.
      get(`/api/orders/current/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type','application.json');

      expect(response.status).toBe(200);
      const{quantity,status,product_id} = response.body.data;
      expect(quantity).toBe(200)
      expect(status).toBe('active')
      expect(product_id).toBe(product.id)
    });

    it('(getActiveOrders) get Active Order  by user id' ,async () => {
      const response: supertest.Response = await request.
      get(`/api/orders/active/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-type','application.json');

      expect(response.status).toBe(200);
      const{quantity,status} = response.body.data;
      expect(quantity).toBe(200);
      expect(status).toBe('active');
    });

    it('should delete order', async () => {
      const response = await request
        .delete(`/api/orders/delete/${order.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      const{id,product_id,user_id,quantity,status} = response.body.data;
      expect(id).toBe(order.id);
      expect(quantity).toBe(10)
      expect(status).toBe('active')
    });
  });
});
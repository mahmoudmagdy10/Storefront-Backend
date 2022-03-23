import {productStore,Products } from '../../product';
import {Users ,User} from '../../user';
import supertest from 'supertest';
import { server } from '../../../server';
import db from '../../../database';

const request= supertest(server);
const productModel = new productStore();
const userModel = new Users();
let token: string ='';

describe('Products API Endpoint ', () => {
  const product ={
    name: 'iphone',
    price: 700,
    category:'phone',
  } as Products;

  const user ={
    firstname: 'mahmoud',
    lastname: 'magdy',
    password: 'mypassword123',
  } as User;

  beforeAll(async () => {
    const createProduct = await productModel.create(product);
    product.id = createProduct.id;

    const createUser = await userModel.create(user);
    user.id = createUser.id;
  });

  afterAll(async() => {
    const connection = await db.connect();
    const sql1 ='DELETE FROM products';
    const sql2 ='DELETE FROM users';
    await connection.query(sql1);
    await connection.query(sql2);
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
  })

  describe('Test CRUD API Endpoint Methods ', () => {

    it('should create new product', async () => {
      const res = await request
        .post('/api/products/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'shirt',
          price: 700,
          category:'clothes',
        } as Products);

      expect(res.status).toBe(200)
      const { name,price,category } = res.body.data
      expect(name).toBe('shirt')
      expect(price).toBe(700)
      expect(category).toBe('clothes')
    })


		it('(index) show all products' ,async () => {
      const response: supertest.Response = await request.
      get('/api/products')
      .set('Content-type','application.json');

      expect(response.status).toBe(200);
    });

    it('show product by id', async () => {
      const response = await request
        .get(`/api/products/${product.id}`)
        .set('Content-type', 'application/json')

      expect(response.status).toBe(200);
      const{category,price,name} = response.body.data;
      expect(name).toBe('iphone')
      expect(price).toBe(700)
      expect(category).toBe('phone')
    });


    it('should delete product', async () => {
      const response = await request
        .delete(`/api/products/${product.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      const{category,price,name,id} = response.body.data;
      expect(id).toBe(product.id);
      expect(name).toBe('iphone')
      expect(price).toBe(700)
      expect(category).toBe('phone')
    });

  });
});
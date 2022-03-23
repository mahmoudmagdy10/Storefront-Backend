import {productStore,Products } from '../../product';
import db from '../../../database';

const store = new productStore();

describe("product Model", () => {
  describe('Test methods exists',()=>{
    it('should have an index method', () => {
      expect(store.index).toBeDefined();
    });
  
    it('should have a show by id method', () => {
      expect(store.show).toBeDefined();
    });
    it('should have a create method', () => {
      expect(store.create).toBeDefined();
    });  
  
    it('should have a delete method', () => {
      expect(store.delete).toBeDefined();
    });
  
  });
  describe('Test product logics',() => {
    const product ={
      name: 'iPhone',
      price: 700,
      category:'phone',
    } as Products;

    beforeAll(async()=>{
      const createProduct = await store.create(product);
      product.id = createProduct.id;
    });
    afterAll(async() => {
      const connection = await db.connect();
      const sql ='DELETE FROM products';
      await connection.query(sql);
      connection.release();
    });

    it('create method should add a product', async () => {
      const createProduct = await store.create({
        name: 'shirt',
        price: 90,
        category:'clothes',
      });      
      expect(createProduct).toEqual({
        id: createProduct.id,
        name: 'shirt',
        price: 90,
        category:'clothes',
      });
    });

    it('index method should return a list of products', async () => {
      const ShowProducts = await store.index();
      expect(ShowProducts.length).toBe(2);
    });

    it('show method should return the  product by id', async () => {
      const result = await store.show(product.id as number);
      expect(result).toEqual({
        id:product.id,
        name: 'iPhone',
        price: 700,
        category:'phone',    
      });
    });

    // it('show method should return the  product by id', async () => {
    //   const result = await store.show(product.id as number);
    //   expect(result.id).toBe(product.id);
    //   expect(result.name).toBe(product.name);
    //   expect(result.price).toBe(product.price);
    //   expect(result.category).toBe(product.category);
    // });


    it('delete method should remove the product', async () => {
      const deleted = await store.delete(product.id as number);
  
      expect(deleted.id).toBe(product.id)

    });
  });
});

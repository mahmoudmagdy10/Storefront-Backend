// @ts-ignore
import Client from '../database'

export type Products = {
  id?: number;
  name: string;
  price: number;
  category:string;
}

export class productStore {
  async index(): Promise<Products[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows ;
    } catch (err) {
      throw new Error(`Could not get Products. Error: ${err}`);
    }
  };

  async show(id: number): Promise<Products> {
    try {
    const sql = 'SELECT * FROM products WHERE id=($1)';
    const conn = await Client.connect();
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
    } catch (err) {
        throw new Error(`Could not find product ${id}. Error: ${err}`);;
    }
  };

  async create(p: Products): Promise<Products> {
    try {
      const sql = 'INSERT INTO products (name, price,category) VALUES($1, $2,$3) RETURNING *';
      const conn = await Client.connect();
      const result = await conn
          .query(sql, [p.name, p.price,p.category]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
        throw new Error(`Could not add new product ${p}. Error: ${err}`);
    }
  };

  async delete(id: number): Promise<Products> {
      try {
    const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
    const conn = await Client.connect();
    const result = await conn.query(sql, [id]);
    const product = result.rows[0];
    conn.release();
    return product;
      } catch (err) {
          throw new Error(`Could not delete product ${id}. Error: ${err}`);
      }
  };
}
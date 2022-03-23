import Client from '../database'

export type Order = {
  id?: number;
  product_id?: number;
  user_id?: number;
  quantity: number;
  status:string;
}

export class Orders {

  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows ;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }


  async getOrder(userId: number): Promise<Order> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id =($1)';
      const result = await conn.query(sql,[userId]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async create(o: Order): Promise<Order> {
      try {
    const sql = 'INSERT INTO orders (product_id, user_id, quantity,status) VALUES($1, $2, $3,$4) RETURNING *';
    const conn = await Client.connect();
    const result = await conn.query(sql, [o.product_id, o.user_id, o.quantity,o.status]);
    const order = result.rows[0];
    conn.release();
    return order;

      } catch (err) {
          throw new Error(`Could not add new order ${o}. Error: ${err}`);
      }
  }

  async currentOrderByUserId(userId:number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) ORDER BY id DESC LIMIT 1';
      const conn = await Client.connect();
      const result = await conn
          .query(sql, [userId]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
        throw new Error(`Could not get current  order by user Id ${userId}. Error: ${err}`);
    }
}

async delete(id: number): Promise<Order> {
  try {
    const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
    const conn = await Client.connect();
    const result = await conn.query(sql, [id]);
    const product = result.rows[0];
    conn.release();
    return product;
  } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
  }
};

  // Get active order by user id
  async getActiveOrders(userId: number): Promise<Order> {
    try {
      const status = 'active';
      const sql = `SELECT * FROM orders WHERE user_id =($1) AND status = 'active'`;
      const conn = await Client.connect();    
      const result = await conn.query(sql, [userId]);
      const order = result.rows[0];
      conn.release();
      return order;    
    } catch (err) {
      throw new Error(`Could not get active order. Error: ${err}`);
    }
  }
}
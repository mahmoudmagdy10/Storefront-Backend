import Client from '../database';
import bcrypt from 'bcrypt';

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  password?: string;
};

const pepper: string = process.env.BCRYPT_PASSWORD as string;
const saltRounds: string = process.env.SALT_ROUNDS as string;
const hashPassword = (password: string) => {
  return bcrypt.hashSync(`${password}${pepper}`, saltRounds)
}

export class Users {
  
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows ;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = `SELECT * FROM users WHERE id=($1)`;
      const connection = await Client.connect();
      const result = await connection.query(sql, [id])
      connection.release();
      return result.rows[0]
    } catch (error) {
      throw new Error(`Could not find user ${id}, ${(error as Error).message}`)
    }
  }


  async create(u: User): Promise<User> {
    try {
      const sql = 'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING id,firstname,lastname';
      const conn = await Client.connect();
      const hash = bcrypt.hashSync(u.password+pepper, parseInt(saltRounds));
      const result = await conn.query(sql, [u.firstname, u.lastname, hash]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
        throw new Error(`Could not add new user ${u}. Error: ${err}`);
    }
  };

  async authenticate(firstname: string,lastname:string ,password: string): Promise<User | null> {
    try{
      const conn = await Client.connect()
      const sql = 'SELECT password FROM users WHERE firstname=$1 AND lastname=$2'
      const result = await conn.query(sql, [firstname,lastname]);
  
      if(result.rows.length) {
        const { password: hashPassword } = result.rows[0];
        const isPasswordValid = bcrypt.compareSync(
          `${password}${pepper}`,
          hashPassword
        )
        if (isPasswordValid) {
          const sql = 'SELECT * FROM users WHERE firstname=$1 AND lastname=$2'
          const result = await conn.query(sql, [firstname,lastname]); 
          return result.rows[0]       
        }
      }
      conn.release();
      return null
    } catch(err){
      throw new Error(`Unabled to login`);
    }
  }
  async delete(id: number): Promise<User> {
      try {
    const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
    const conn = await Client.connect();

    const result = await conn.query(sql, [id]);

    const user = result.rows[0];

    conn.release();

    return user;
      } catch (err) {
          throw new Error(`Could not delete user ${id}. Error: ${err}`);
      }
  }
}
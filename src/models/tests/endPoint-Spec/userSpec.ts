import {Users ,User} from '../../user';
import supertest from 'supertest';
import { server } from '../../../server';
import db from '../../../database';

const request = supertest(server);
const userModel = new Users();

let token: string ='';

describe('User API Endpoints', () => {
  const user = {
    firstname: 'test',
    lastname: 'user',
    password: 'test123',
  } as User

  beforeAll(async () => {
    const createdUser = await userModel.create(user)
    user.id = createdUser.id

  })

  afterAll(async () => {
    // clean db
    const connection = await db.connect()
    // if you are not using uuid u need to add `\nALTER SEQUENCE users_id_seq RESTART WITH 1;`
    const sql = 'DELETE FROM users;'
    await connection.query(sql)
    connection.release()
    console.log(token)
  })

  describe('Test Authenticate methods', () => {
    it('should be able to authenticate to get token', async () => {
      const res = await request
        .post('/api/users/authenticate')
        .set('Content-type', 'application/json')
        .send({
          firstname: 'test',
          lastname: 'user',
          password: 'test123',
        })
      expect(res.status).toBe(200)
      const { id, firstname,lastname, token: userToken } = res.body.data
      expect(id).toBe(user.id)
      expect(firstname).toBe('test')
      expect(lastname).toBe('user')
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

  describe('Test CRUD API methods', () => {
    it('should create new user', async () => {
      const res = await request
        .post('/api/users/')
        .set('Content-type', 'application/json')
        .send({
          firstname: 'test2',
          lastname: 'user2',
          password: 'test123',
        } as User)
      expect(res.status).toBe(200)
      const { firstname,lastname } = res.body.data
      expect(firstname).toBe('test2')
      expect(lastname).toBe('user2')
    })

    it('should get list of users', async () => {
      const res = await request
        .get('/api/users/')
        .set('Content-type', 'application/json')
        .set('authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
    })

    it('should get user info', async () => {
      const res = await request
        .get(`/api/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(res.body.data.firstname).toBe('test')
      expect(res.body.data.lastname).toBe('user')
    })


    it('should delete user', async () => {
      const res = await request
        .delete(`/api/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(res.body.data.id).toBe(user.id)
      expect(res.body.data.firstname).toBe('test')
      expect(res.body.data.lastname).toBe('user')
    })
  })
})
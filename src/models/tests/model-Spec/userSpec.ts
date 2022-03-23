import {User , Users} from '../../user';
import db from '../../../database';

const store = new Users();


describe("Users Model", () => {

  describe('Test methods exists',()=>{
    it('should have an index method', () => {
      expect(store.index).toBeDefined();
    });
  
    it('should have a show method', () => {
      expect(store.show).toBeDefined();
    });
  
    it('should have a create method', () => {
      expect(store.create).toBeDefined();
    });  
    it('should have a authenticate method', () => {
      expect(store.authenticate).toBeDefined();
    });
  
    it('should have a delete method', () => {
      expect(store.delete).toBeDefined();
    });  
  });

  describe('Test User Model Logic', () => {
    const user = {
      firstname: 'test',
      lastname: 'user',
      password: 'test123',
    } as User

    beforeAll(async () => {
      const createdUser = await store.create(user)
      user.id = createdUser.id
    })

    afterAll(async () => {
      const connection = await db.connect()
      // if you are not using uuid u need to add `\nALTER SEQUENCE users_id_seq RESTART WITH 1;`
      const sql = 'DELETE FROM users;'
      await connection.query(sql)
      connection.release()
    })

    it('Create method should return a New User', async () => {
      const createdUser = await store.create({
        firstname: 'test2',
        lastname: 'user2',
        password: 'test123',
      } as User)
      expect(createdUser).toEqual({
        id: createdUser.id,
        firstname: 'test2',
        lastname: 'user2',
      } as User);
      expect(createdUser.password).not.toEqual("test123")
    })

    it('Get Many method should return All available users in DB', async () => {
      const users = await store.index()
      expect(users.length).toBe(2)
    })

    it('Get One method should return testUser when called with ID', async () => {
      const returnedUser = await store.show(user.id as number)
      expect(returnedUser.id).toBe(user.id)
      expect(returnedUser.firstname).toBe(user.firstname)
      expect(returnedUser.lastname).toBe(user.lastname)
    })

    it('Delete One method should delete user from DB', async () => {
      const deletedUser = await store.delete(user.id as number)
      expect(deletedUser.id).toBe(user.id)
    })
  })
});

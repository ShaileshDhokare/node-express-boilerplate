const request = require('supertest');
const app = require('../../src/app');

const Request = request(app);

describe('auth APIs', () => {
  beforeAll(() => {});
  afterAll(() => {});

  it('should return an error if email is already exists', async () => {
    const user = {
      firstname: 'Test',
      lastname: 'User',
      username: 'testuser',
      email: 'test.user@test.com',
      password: 'test@123',
    };

    const response = await Request.post('/api/v1/auth/register').send(user);
    expect(response.statusCode).toBe(400);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('message', `Duplicate entry 'test.user@test.com' for key 'users.email'`);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0]).toEqual({
      message: 'email must be unique',
      type: 'unique violation',
      path: 'email',
      value: 'test.user@test.com',
    });
  });

  it('should return an error if invalid values are provided', async () => {
    const user = {
      firstname: 'T',
      lastname: 'User',
      username: '',
      email: 'test.user#test.com',
      password: 'test@123',
    };

    const response = await Request.post('/api/v1/auth/register').send(user);
    expect(response.statusCode).toBe(400);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty(
      'message',
      'Values provided to input fields(firstname, email, username, username) are not valid.'
    );
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(4);
    expect(response.body.data[0]).toEqual({
      message: 'firstname must be at least 2 characters',
      path: 'firstname',
    });
    expect(response.body.data[1]).toEqual({
      message: 'email must be a valid email',
      path: 'email',
    });
    expect(response.body.data[2]).toEqual({
      message: 'username is a required field',
      path: 'username',
    });
    expect(response.body.data[3]).toEqual({
      message: 'username must be at least 6 characters',
      path: 'username',
    });
  });
});

const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const app = require('../../src/app');

const Request = request(app);

describe('Register user', () => {
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
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
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
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
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

describe('Login user', () => {
  it('should return user data and jwt token in response on successful login', async () => {
    const payload = {
      username: process.env.TEST_USERNAME,
      password: process.env.TEST_PASSWORD,
    };

    const response = await Request.post('/api/v1/auth/login').send(payload);
    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.OK);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('message', 'User has been successfully logged in.');
    expect(body).toHaveProperty('metadata');
    expect(body.metadata).toHaveProperty('accessToken');
    expect(body).toHaveProperty('data');
    expect(Object.keys(body.data)).toEqual(['userId', 'name', 'firstname', 'lastname', 'username', 'email']);
  });

  it('should return user data and cookies in response on successful login', async () => {
    const payload = {
      username: process.env.TEST_USERNAME,
      password: process.env.TEST_PASSWORD,
    };

    const response = await Request.post('/api/v1/auth/login').query({ httpCookie: true }).send(payload);
    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.OK);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('message', 'User has been successfully logged in.');
    expect(body).toHaveProperty('data');
    expect(Object.keys(body.data)).toEqual(['userId', 'name', 'firstname', 'lastname', 'username', 'email']);
    expect(body).not.toHaveProperty('metadata');
  });

  it('should throw error if user does not exists', async () => {
    const payload = {
      username: 'wrong-username',
      password: 'wrong-password',
    };

    const response = await Request.post('/api/v1/auth/login').query({ httpCookie: true }).send(payload);
    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('message', 'Record not found');
  });

  it('should throw validation error if input fields are empty', async () => {
    const payload = {
      username: '',
      password: 'wrong',
    };

    const response = await Request.post('/api/v1/auth/login').query({ httpCookie: true }).send(payload);
    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty(
      'message',
      'Values provided to input fields(username, username, password) are not valid.'
    );
    expect(Array.isArray(body.data)).toBe(true);
    expect(response.body.data.length).toBe(3);
    expect(response.body.data[0]).toEqual({
      message: 'username is a required field',
      path: 'username',
    });
    expect(response.body.data[1]).toEqual({
      message: 'username must be at least 6 characters',
      path: 'username',
    });
    expect(response.body.data[2]).toEqual({
      message: 'password must be at least 6 characters',
      path: 'password',
    });
  });

  it('should throw error if password does not match', async () => {
    const payload = {
      username: process.env.TEST_USERNAME,
      password: 'wrong-password',
    };

    const response = await Request.post('/api/v1/auth/login').query({ httpCookie: true }).send(payload);
    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('message', `Password didn't matched`);
  });
});

describe('Logout user and auth middleware', () => {
  it('should return an error if no authorization is provided', async () => {
    const response = await Request.get('/api/v1/auth/logout');
    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('message', 'Not authorized to access this route.');
  });

  it('should return an error if wrong authorization is provided', async () => {
    const token = 'test-bearer-token';
    const response = await Request.get('/api/v1/auth/logout').set('Authorization', `Bearer ${token}`);
    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('message', 'jwt malformed');
  });

  it('should return response on successful logout', async () => {
    const payload = {
      username: process.env.TEST_USERNAME,
      password: process.env.TEST_PASSWORD,
    };

    const {
      body: {
        metadata: { accessToken },
      },
    } = await Request.post('/api/v1/auth/login').send(payload);

    const response = await Request.get('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Cookie', ['accessToken=tokenValue']);

    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.OK);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('message', 'You have been successfully logged out.');
  });
});

describe('404 Route', () => {
  it('should return an error if non-existent route called', async () => {
    const response = await Request.get('/api/v1/test-not-found');
    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('message', 'URL Not Found - /api/v1/test-not-found');
  });
});

describe('should return message if application is live', () => {
  it('should return success response', async () => {
    const response = await Request.get('/');
    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.OK);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('message', 'Application is live.');
  });
});

const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const app = require('../../src/app');

const Request = request(app);

describe('Update user profile', () => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');

  const payload = {
    designation: 'QA Engineer',
    profileSummary: 'I am QA Engineer, working in software company',
    country: 'india',
    gender: 'Male',
    birthdate: '1995-03-19',
  };

  it('should return a response if profile updated successfully', async () => {
    const imagePath = path.resolve(__dirname, '../assets/user-image.png');

    const response = await Request.post('/api/v1/profile')
      .set('Authorization', `Basic ${credentials}`)
      .set('Content-Type', 'multipart/form-data')
      .field('designation', payload.designation)
      .field('profileSummary', payload.profileSummary)
      .field('country', payload.country)
      .field('gender', payload.gender)
      .field('birthdate', payload.birthdate)
      .attach('avatar', imagePath);

    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.OK);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('message', 'Profile has been updated successfully.');
    expect(body).toHaveProperty('data');
    expect(Object.keys(body.data)).toEqual(['id', 'firstname', 'lastname', 'username', 'email', 'profile']);
    expect(Object.keys(body.data.profile)).toEqual([
      'designation',
      'profileSummary',
      'avatar',
      'country',
      'gender',
      'birthdate',
    ]);
  });

  it('should return an error if wrong avatar format is uploaded', async () => {
    const imagePath = path.resolve(__dirname, '../assets/dummy.pdf');

    const response = await Request.post('/api/v1/profile')
      .set('Authorization', `Basic ${credentials}`)
      .set('Content-Type', 'multipart/form-data')
      .field('designation', payload.designation)
      .field('profileSummary', payload.profileSummary)
      .field('country', payload.country)
      .field('gender', payload.gender)
      .field('birthdate', payload.birthdate)
      .attach('avatar', imagePath);

    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('message', 'Only jpg, jpeg, and png files are allowed.');
  });

  it('should return a validation error if required field is missing', async () => {
    const imagePath = path.resolve(__dirname, '../assets/user-image.png');

    const response = await Request.post('/api/v1/profile')
      .set('Authorization', `Basic ${credentials}`)
      .set('Content-Type', 'multipart/form-data')
      .field('profileSummary', payload.profileSummary)
      .field('country', payload.country)
      .field('gender', payload.gender)
      .field('birthdate', payload.birthdate)
      .attach('avatar', imagePath);

    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('message', 'Values provided to input fields(designation) are not valid.');
    expect(Array.isArray(body.data)).toBe(true);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0]).toEqual({
      message: 'designation is a required field',
      path: 'designation',
    });
  });
});

describe('Update user profile', () => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');

  it('should return a response if profile updated successfully', async () => {
    const response = await Request.get('/api/v1/profile').set('Authorization', `Basic ${credentials}`);

    const { statusCode, body } = response;
    expect(statusCode).toBe(StatusCodes.OK);
    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('data');
    expect(Object.keys(body.data)).toEqual(['id', 'firstname', 'lastname', 'username', 'email', 'profile']);
    expect(Object.keys(body.data.profile)).toEqual([
      'designation',
      'profileSummary',
      'avatar',
      'country',
      'gender',
      'birthdate',
    ]);
  });
});

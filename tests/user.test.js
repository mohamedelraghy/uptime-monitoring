const axios = require('axios');
const server = require('../index');
const mongoose = require('mongoose');

// Import your user model
const { User } = require('../models/user');
const { Check } = require('../models/check');
const API_BASE_URL = 'http://localhost:3000/api/users';
 

// Create a test database connection
beforeAll(async () => {
  const url = 'mongodb://rootuser:rootpass@localhost:27017/test';
  await mongoose.connect(url, { useNewUrlParser: true, authSource: "admin" });
});

// Disconnect from test database
afterAll(async () => {
  server.close();
  await mongoose.disconnect();
});

// Clear test database before each test
beforeEach(async () => {
  await User.deleteMany();
});

describe('User Signup', () => {
  it('should create a new user with valid credentials', async () => {
    beforeEach(async () => {
      const user = new User({
        name: "MOhamed",
        email: "test@test.com",
        password: "password",
        confirm_password: "password"
      });
      await user.save();
      const check = new check({
        name: google,
        url: "Localhost",
        protocol: "https",
        path:"/api",
        createdBy: user._id
      });
      check.save();
    });
    
    const res = await axios.post(`${API_BASE_URL}/signup`, {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      confirm_password: "password"
    });
    
  

    expect(res.status).toEqual(201);
    expect(res.data).toHaveProperty('user');
    expect(res.data.user).toHaveProperty('name', 'John Doe');
    expect(res.data.user).toHaveProperty('email', 'johndoe@example.com');
    expect(res.data).toHaveProperty('user');
  });

  it('should not create a new user with invalid email', async () => {
    try {
      await axios.post(`${API_BASE_URL}/signup`, {
        name: 'John Doe',
        email: 'invalid_email',
        password: 'password123',
        confirm_password: 'password123'
      });
    } catch (error) {
      expect(error.response.status).toEqual(422);
      expect(error.response.data).toHaveProperty('error');
    }
  });

  it('should not create a new user with weak password', async () => {
    try {
      await axios.post(`${API_BASE_URL}/signup`, {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'weak',
        confirm_password: 'weak'
      });
    } catch (error) {
      expect(error.response.status).toEqual(422);
      expect(error.response.data).toHaveProperty('error', '\"password\" length must be at least 8 characters long');
    }
  });
})

describe('User Login', () => {
  // Create a user before running the tests
  beforeEach(async () => {
    await axios.post(`${API_BASE_URL}/signup`, {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      confirm_password: "password"
    });
  });

  it('should login with valid credentials', async () => {
    const res = await axios.post(`${API_BASE_URL}/login`, {
      email: 'johndoe@example.com',
      password: 'password',
    });

    expect(res.status).toEqual(200);
    expect(res.data).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    try {
      await axios.post(`${API_BASE_URL}/login`, {
        email: 'johndoe@example.com',
        password: 'invalid_password',
      });
    } catch (error) {
      expect(error.response.status).toEqual(401);
      expect(error.response.data).toHaveProperty('message', 'Invalid email or password');
    }
  });
});

describe('Email Verification', () => {
  // Create a user before running the tests
  let token;
  let PIN;
  beforeEach(async () => { 
    const user = await axios.post(`${API_BASE_URL}/signup`, {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      confirm_password: "password"
    });
    PIN = user.data.PIN;

    const res = await axios.post(`${API_BASE_URL}/login`, {
      email: 'johndoe@example.com',
      password: 'password',
    });

    token = res.data.token;
  });

  it('should verifiy with valid credentials', async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${token}`
    };

    const body = { PIN: PIN.toString() }
    const res = await axios.post(`${API_BASE_URL}/verifiy`, body, { headers });

    expect(res.status).toEqual(200);
    expect(res.data.accountIsActive).toBe(true);
  });

  it('should not verifiy with Invalid PIN', async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${token}`
    };

    const body = { PIN: "invalid PIN" }
    try {
      const res = await axios.post(`${API_BASE_URL}/verifiy`, body, { headers });
    } catch (error) {
      expect(error.response.status).toEqual(422);
      expect(error.response.data).toHaveProperty('error', '\"PIN\" length must be less than or equal to 5 characters long');
    }
  }); 

  it('should not verifiy with unAuth user', async () => {
    const headers = {
      'Content-Type': 'application/json',
    };

    const body = { PIN: PIN.toString() }
    try {
      const res = await axios.post(`${API_BASE_URL}/verifiy`, body, { headers });
    } catch (error) {
      expect(error.response.status).toEqual(401);
      expect(error.response.data).toHaveProperty('message', 'Access denied. No token provided.');
    }
  });
});
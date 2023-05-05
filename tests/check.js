const axios =require('axios');

const API_BASE_URL = 'http://localhost:3000/api/checks';

describe('Check API endpoints', () => {

  beforeAll(async () => {
    // Mock user authentication and get access token or session ID
    const response = await axios.post('/auth/login', { 
      email: 'testuser@example.com', 
      password: 'testpassword' 
    });
    
    userToken = response.data.token;
  });
  
  let createdCheckId;
   
  const login = {email: "test@test.com", password: "password"};
  let token;

  const getToken = async() => {
    try {
      const response = await axios.post("http://localhost:3000/api/users/login", login);
      token = response.data.token;
    } catch (error) {
      throw error;
    }
  }

  getToken();

  test('POST / creates a new check', async ()=> {
    
    const check = {
      "name": "Google",
      "url": "http://www.goewro.com",
      "protocol": "HTTP",
      "tags": [
          "google"
      ],
      "interval": 0.5
  }

    const response = await axios.post(`${API_BASE_URL}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
      },
      check
    });
    
    expect(response.status).toBe(201);
    expect(response.data.check.url).toBe(check.url);

    createdCheckId = response.data.check._id;
  });


  // test('GET / return a list of checks', async () => {
  //   const response = await axios.get(`${API_BASE_URL}`, {
  //     headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `bearer ${token}`
  //     }
  //   });
  //   expect(response.status).toBe(200);
  //   expect(response.data).toBeInstanceOf(Object);
  // });

  
  // test('GET /:id returns a specific check by ID', async () => {
  //   const response = await axios.get(`${API_BASE_URL}/${createdCheckId}`, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `bearer ${token}`
  //     }
  //   });
  //   expect(response.status).toBe(200);
  //   expect(response.data.check._id).toBe(createdPostId);
  // });

  // test('PUT /:id update Check with a give id', async ()=> {
  //   const updatedCheck = {
  //     "name": "Google correct",
  //     "url": "http://www.google.com",
  //     "protocol": "HTTP",
  //     "tags": [
  //         "google"
  //     ],
  //     "interval": 0.5
  //   }

  //   const response = await axios.put(`${API_BASE_URL}/${createdCheckId}`,{ 
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `bearer ${token}`
  //     }, 
  //     updatedCheck
  //   });
  //   expect(response.status).toBe(200);
  //   expect(response.data.check.url).toBe(updatedCheck.url);
  // });

  // test('DELETE /:id delete check with a given id', async() => {
  //   const response = await axios.delete(`${API_BASE_URL}/${createdCheckId}`, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `bearer ${token}`
  //     }
  //   });
  //   expect(response.status).toBe(204);

  //   try {
  //     await axios.get(`${API_BASE_URL}/${createdCheckId}`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `bearer ${token}`
  //       }
  //     });
  //   } catch (error) {
  //     expect(error.response.status).toBe(404);
  //   }
  // });
});
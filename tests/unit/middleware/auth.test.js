const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const auth = require('../../../middleware/is-Auth');


describe('auth middleware', () => {
  it('should populate req with the payload of a valid JWT', () => {
    const user = { 
      _id: new mongoose.Types.ObjectId().toHexString(), 
      email: 'test@test.com' 
    };

    const token = jwt.sign({
      email: user.email,
      userId: user._id.toString()
    },
      process.env.JWT_KEY,
    { expiresIn: '1h' }
    );

    const req = {
      get: jest.fn().mockReturnValue('Bearer ' + token)
    };

    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.userId).toBe(user._id);
    expect(req.userEmail).toBe(user.email);
    expect(req.isAuth).toBe(true);
  });
});
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { User, validate } = require('../../models/user');

module.exports = async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).json({ "error": error.details[0].message });
  }
  try {

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ "error": "User Already registered" });
    }
  
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
  
    if (user.password !== req.body.confirm_password) {
      return res.status(400).json({ "error": "password doesn't match" });
    } 
  
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  
    await user.save();  

    res.status(200).json({ 
      "message": "User Created",
      "id": user._id
    });
    
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
}
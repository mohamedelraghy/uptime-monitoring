const mongoose = require('mongoose');
const Joi = require('joi');

//* User Schema 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    minlength : 5,
    maxlength : 255,
    unique : true
  },
  password : {
    type : String,
    required : true,
    minlength : 8,
    maxlength : 1024
  },
  userIsVerified : {
    type : Boolean,
    default : false
  }
});

//* User model 
const User = mongoose.model('User', userSchema);

//* User Data validation
const validateUser = (user) => {

  const schema = {
    name: Joi.string().min(5).max(30).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required()
  }

  return Joi.validate(user, schema);
}


exports.User = User;
exports.validateUser = validateUser;
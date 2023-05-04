const bcrypt = require('bcrypt');

const { User, loginValidate } = require('../../models/user');

module.exports = async(req, res, next) => {
  const { error } = loginValidate(req.body);
  if (error) {
    return res.status(422).json({ "error": error.details[0].message });
  }

  const email = req.body.email;
  const password = req.body.password;
  
  try {

    const user = await User.findOne({email: email});
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
  
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong Password');
      error.statusCode = 401;
      throw error;
    }
  
    res.status(200).json({
      message: "user logedIn",
      user: {
        id: user._id
      }
    });
  } catch (err) {
    
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
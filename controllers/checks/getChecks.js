const { Check } = require('../../models/check');

module.exports = async (req, res, next) => {

  try {
    const checks = await Check.find({ createdBy: req.userId });
    
    if (!checks) {
      const error = new Error('No Checks found...');
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      checks: checks
    });
    
  } catch (err){
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
} 
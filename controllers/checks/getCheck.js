const { Check } = require('../../models/check');

module.exports = async (req, res, next) => {
  const checkId = req.params.id;
  
  if (!checkId) {
    const error = new Error('Not valid ID');
    error.statusCode = 400;
    return next(err);
  }

  try {
    const check = await Check.findOne({_id: checkId, createdBy: req.userId});
    
    if (!check) {
      const error = new Error('No Check found...');
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      check: check
    });
    
  } catch (err){
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
} 
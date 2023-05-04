const { Check } = require('../../models/check');

module.exports = async (req, res, next) => {
  const checkId = req.params.id;
  
  if (!checkId) {
    const error = new Error('Not valid ID');
    error.statusCode = 400;
    return next(err);
  }

  try {
    
    const deletedCheck = await Check.findOneAndRemove({ _id: checkId, createdBy: req.userId });

    if (!deletedCheck) {
      const error = new Error('check is not found...');
      error.statusCode = 404;
      throw error;
    }

    res.status(201).json({
      message: "check Deleted",
      check: deletedCheck
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
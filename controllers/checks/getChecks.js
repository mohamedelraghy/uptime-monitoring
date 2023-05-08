const { Check } = require('../../models/check');

module.exports = async (req, res, next) => {

  try {
    const tags = req.query.tags;
    const regex = new RegExp(tags, 'i');
    console.log(regex);
    const checks = await Check.find({ $and: [{ createdBy: req.userId}, { tags: regex }] });
    
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
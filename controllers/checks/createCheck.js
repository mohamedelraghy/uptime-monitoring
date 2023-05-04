const _ = require('lodash');
const { Check, validate } = require('../../models/check');

module.exports = async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(422).json({ "error": error.details[0].message });
  }

  try {
    const isCheckExists = await Check.exists({ url: req.body.url, createdBy: req.userId });
    if(isCheckExists) {
      const error = new Error('check Already Exists');
      error.statusCode = 400;
      throw error;
    }

    const check = new Check(_.pick(req.body, [
      'name', 'url', 'protocol', 'path', 'port', 'webhook','threshold', 
      'authentication', 'httpHeaders', 'assert', 'tags', 'ignoreSSL']
    ));

    if (req.body.timeout) check.timeout = req.body.timeout * 1000;
    if (req.body.interval) check.interval = req.body.interval * 1000 * 60;
    
    check.createdBy = req.userId;

    await check.save();
    res.status(200).json({
      message: "Check Created",
      id: check._id
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

}
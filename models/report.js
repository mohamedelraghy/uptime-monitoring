const mongoose = require('mongoose');
const Joi = require('joi');

//* Report Schema 
const reportSchema = new mongoose.Schema({
  status: { type: String, required: true },
  availability: { type: Number, required: true },
  ups: { type: Number, required: true },
  outages: { type: Number, required: true },
  downtime: { type: Number, required: true },
  uptime: { type: Number, required: true },
  aveResponseTime: { type: Number, required: true },
  history: { type: [], required: true },
  timestamp: { type: Date, required: true },
  forCheck: { type: mongoose.Types.ObjectId, ref: 'Check' },
});

//* Report model 
const Report = mongoose.model('Report', reportSchema);

//* Report Data validation
const validateReport = report => {

  const schema = Joi.object ({
    status: Joi.string().required(),
    availability: Joi.number().positive().required(),
    ups: Joi.number().number().positive().required(),
    outages: Joi.number().number().positive().required(),
    downtime: Joi.number().number().positive().required(),
    uptime: Joi.number().number().positive().required(),
    aveResponseTime: Joi.number().number().positive().required(),
    history: Joi.array().required(),
    timestamp: Joi.date().required(),
  });
  return schema.validate(report);
}

exports.Report = Report;
exports.validate = validateReport;
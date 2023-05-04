const user = require('../routes/user');
const check = require('../routes/check');

module.exports = app => {
  app.use('/api/users', user);
  app.use('/api/checks', check)
}
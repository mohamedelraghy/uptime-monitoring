const express = require('express');
const app = express();

require('./startup/middleware')(app);   //* calling some Middleware
if (process.env.ENV !== 'test'){
  require('./startup/db')();              //* connection to DB 
}
require('./startup/routes')(app);       //* API routes
require('./startup/errorHandler')(app); //* Error handler
require('./startup/pingAllChecks')();   //* Start Ping all checks exists in DB;

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

module.exports = app;
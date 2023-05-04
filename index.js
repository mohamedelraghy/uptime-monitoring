const express = require('express');
const app = express();

require('./startup/middleware')(app);   //* calling some Middleware
require('./startup/db')();              //* connection to DB 
require('./startup/routes')(app);       //* API routes
require('./startup/errorHandler')(app);      //* Error handler

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
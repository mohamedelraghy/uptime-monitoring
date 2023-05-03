const express = require('express');
const app = express();

require('./startup/db')();      //* connection to DB 


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
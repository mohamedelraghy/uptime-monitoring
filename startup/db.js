const mongoose = require('mongoose');

module.exports = function(){

  mongoose.connect(process.env.MONGODB_URI, { authSource:"admin" })
    .then(() => {
      console.log("connection to DB");
    });
}
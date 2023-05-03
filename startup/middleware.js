const express = require('express');

module.exports = app => {
  app.use(express.json());          //*  consuming and producing application/json

  app.use((req, res, next) => {     //!  solvine CORS ERORR to share resources with Front-end
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");    
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
} 
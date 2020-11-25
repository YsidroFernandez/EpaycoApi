'use strict'

const express = require('express');
const api = express.Router();
const { AuthMiddleware } = require('../middelwares');


/****************** Users ********************* */

api.get('/register',function(req,res){
  res.send('User registered');
  
});



module.exports = api
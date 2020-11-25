'use strict'

const express = require('express');
const api = express.Router();
const { AuthMiddleware } = require('../middelwares');
const { UserController } = require('../controllers');


/****************** Users ********************* */

api.post('/singup',UserController.singUp);
api.post('/singin',UserController.singIn);

module.exports = api
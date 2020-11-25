'use strict'

const express = require('express');
const api = express.Router();
const { AuthMiddleware } = require('../middelwares');
const { UserController, CardController } = require('../controllers');


/****************** Users ********************* */

api.post('/singup',UserController.singUp); //Create user
api.post('/singin',UserController.singIn);  //Login user
api.get('/user',AuthMiddleware,UserController.getUsers); // get all users
api.get('/user/:userId',AuthMiddleware,UserController.getUserById); //get one user by ID
api.put('/user/:userId',AuthMiddleware,UserController.updateUser)  //update users

/********************Cards************************* */
api.post('/registerCard',AuthMiddleware,CardController.saveCard); // Register card


module.exports = api
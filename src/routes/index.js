'use strict'

const express = require('express');
const api = express.Router();
const { AuthMiddleware } = require('../middelwares');
const { UserController, CardController, AccountController, PurchaseController } = require('../controllers');


/****************** Users ********************* */

api.post('/singup',UserController.singUp); //Create user
api.post('/singin',UserController.singIn);  //Login user
api.get('/user',AuthMiddleware,UserController.getUsers); // get all users
api.get('/user/:userId',AuthMiddleware,UserController.getUserById); //get one user by ID
api.put('/user/:userId',AuthMiddleware,UserController.updateUser)  //update users

/********************Cards********************* */
api.post('/registerCard',AuthMiddleware,CardController.saveCard); // Register card
api.get('/card',AuthMiddleware,CardController.getCards); // get all cards
api.get('/card/:cardId',AuthMiddleware,CardController.getCardById); //get one card by ID
api.put('/card/:cardId',AuthMiddleware,CardController.updateCard)  //update card
api.delete('/card/:cardId',AuthMiddleware,CardController.deleteCard)  //update card

/********************Accoount***************** */
api.post('/registerAccount',AuthMiddleware,AccountController.registerAccount); // Register virtual account
api.get('/account',AuthMiddleware,AccountController.getAccounts); // get all accounts
api.delete('/account/:accountId',AuthMiddleware,AccountController.deleteAccount)  //delete account
api.put('/recharge',AuthMiddleware,AccountController.reachargeBalance); //recharge Balance

/*******************Purchase***************** */
api.post('/registerPurchase',AuthMiddleware,PurchaseController.registerPurchase); // Send Pruchase
api.post('/confirmPurchase',AuthMiddleware,PurchaseController.confirmPruchase); // Send Pruchase
api.get('/getPurchases',AuthMiddleware,PurchaseController.getPurchases); // get all cards

module.exports = api
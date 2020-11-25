'use strict'

const { AccountModel, UserModel } = require('../models')


function registerAccount(req, resp) { 
    
    
    
    var account = new AccountModel(
        {
            virtual_number: req.body.virtual_number,
            card: req.body.card,
            user: req.body.user,
            balance: req.body.balance,
        }
    );


    account.save((err, accountStored) => {
        if (err) resp.status(500).send({ status : 500, message: `Error to register the account ${err}` })

        resp.status(200).send({ status: 200, card: accountStored, message: "Account registered successfully" });
    })
}



function getAccounts(req, resp) {

    AccountModel.find({}, (err, accounts) => {
        if (err) return resp.status(500).send({ message: `Failed request ${err}` })
        if (!accounts) return resp.status(404).send({ message: 'The accounts does not exist' })

        resp.status(200).send({ status: 200, accounts })
    })
}

function getAccountById(req, resp) {
    let accountId = req.params.accountdId
    AccountModel.findById(accountId, (err, account) => {
        if (err) return resp.status(500).send({ message: `Failed request ${err}` })
        if (!account) return resp.status(404).send({ message: `The accounts does not exist` })

        resp.status(200).send({ status: 200, account })
    })
}

function updateAccount(req, resp) {
    let accountId = req.params.accountId
    let update = req.body

    AccountModel.findByIdAndUpdate(accountId, update, (err, accountUpdate) => {
        if (err) return resp.status(500).send({ message: `Failed request ${err}` })

        resp.status(200).send({ status: 200, account: accountUpdate, message : "account update suceessfully" })
    })
}

function deleteAccount(req, resp) {
    let accountId = req.params.accoountId

    AccountModel.findOneAndDelete(accountId,(err, account) => {
        if (err) return resp.status(500).send({ message: `Failed request ${err}` })

        resp.status(200).send({ status: 200, account: account , message : "Account removed"})
    })
}

function reachargeBalance(){

}
module.exports = {
    registerAccount,
    getAccounts,
    getAccountById,
    updateAccount,
    deleteAccount
}
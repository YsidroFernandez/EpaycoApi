'use strict'

const { AccountModel, UserModel } = require('../models')


function getAccounts(req, resp) {

    AccountModel.find({}, (err, accounts) => {
        if (err) return resp.status(500).send({ message: `Error de solicitud ${err}` })
        if (!accounts) return resp.status(404).send({ message: 'Cuentas virtuales no encontradas' })

        resp.status(200).send({ status: 200, accounts })
    })
}

function getAccountById(req, resp) {
    let accountId = req.params.accountdId
    AccountModel.findById(accountId, (err, account) => {
        if (err) return resp.status(500).send({ message: `Error de solicitud ${err}` })
        if (!account) return resp.status(404).send({ message: `Cuenta no encontrada` })

        resp.status(200).send({ status: 200, account })
    })
}

function updateAccount(req, resp) {
    let accountId = req.params.accountId
    let update = req.body

    AccountModel.findByIdAndUpdate(accountId, update, (err, accountUpdate) => {
        if (err) return resp.status(500).send({ message: `Error de solicitud ${err}` })

        resp.status(200).send({ status: 200, account: accountUpdate, message : "Cuenta actualizada correctamente" })
    })
}

function deleteAccount(req, resp) {
    let accountId = req.params.accoountId

    AccountModel.findOneAndDelete(accountId,(err, account) => {
        if (err) return resp.status(500).send({ message: `Error de solicitud ${err}` })

        resp.status(200).send({ status: 200, account: account , message : "Cuenta eliminada correctamente"})
    })
}

function reachargeBalance(req,resp){

    let  balance = parseInt(req.body.balance);

    UserModel.find({ document: req.body.document, phone: req.body.phone }, (err, user) =>{
        if(err) return resp.status(500).send({message : `Error de solicitud ${err}`});

        
        if(user.length > 0){
            let id_user = user[0]['_id'];
            
            
            

            // Find the virtual account

            AccountModel.find({user : id_user},(error, account)=>{

                if(account.length > 0){
                    
                    let new_account = account[0];

                    new_account.balance =  new_account.balance + balance;

                    AccountModel.findOneAndUpdate({user : id_user}, new_account, { new :true }, (error, account)=>{
                        if(error) return resp.status(500).send({ message : `Error al hacer la racarga ${error}`});
        
                        resp.status(200).send({status : 200 ,account ,message : 'Recarga satisfactoria'});
        
                    });


                }else{
                    resp.status(200).send({status : 200 ,account ,message : 'Cuenta virtual no encontrada'});
                }
                

                
            });
            
                

        }else{
            resp.status(200).send({status : 404 ,message : 'Usuario no encontrado'});

        }
        
        
    });
}


function checkBalance(req,resp){

    let document = req.body.document;
    let phone = req.body.phone;

    UserModel.find({ document: document, phone: phone }, (err, user) =>{
        if(err) return resp.status(500).send({message : `Error de solicitud ${err}`});

        
        if(user.length > 0){
            
            // Find the virtual account

            let usuario = user[0];
            let id_user = usuario._id;

            AccountModel.find({user : id_user},(error, account)=>{

                if(account.length > 0){
                    
                    resp.status(200).send({status : 200 ,account ,message : 'Consulta satisfactoria'});

                }else{
                    resp.status(200).send({status : 200 ,account ,message : 'Cuenta virtual no encontrada'});
                }
                
            });
            
                

        }else{
            resp.status(200).send({status : 404 ,message : 'Usuario no encontrado'});

        }
        
        
    });
}




module.exports = {
    getAccounts,
    getAccountById,
    updateAccount,
    deleteAccount,
    reachargeBalance,
    checkBalance
}
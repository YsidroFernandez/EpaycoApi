'use strict'

const { PurchaseModel, AccountModel } = require('../models')
const nodemailer = require("nodemailer");

function registerPurchase(req, resp) { 
    

    //Generate token
    let cod = '';
    for(var i=0; i<6 ; i++){
        cod += Math.floor((Math.random() * (9 - 1 + 1)) + 1);
     }

    let amount = req.body.amount;
    let session_id = req.sessionID;
    let token = cod;
    let id_user = req.body.id_user;


    


     AccountModel.find({user : id_user},(error, account)=>{
        
        if(account.length > 0){
            
            let new_account = account[0];

            if(new_account.balance >  amount ){

                var purchase = new PurchaseModel(
                    {
                        amount: amount,
                        session_id : req.sessionID,
                        token : cod,
                        user: id_user
                    }
                );
            
            
                purchase.save((err, purchaseStored) => {
                    if (err) resp.status(500).send({ status : 500, message: `Error al registrar la compra ${err}` })
                    
                    if(purchaseStored != null){

                        sendEmail(req,resp,token);
                    }

                })

            }else{
                resp.status(200).send({status : 401 ,message : 'Saldo insuficiente'});  
            }

        }else{
            resp.status(200).send({status : 404 ,message : 'No posee una cuenta virtual'});
        }
        

        
    });


    
}

function sendEmail(req,resp, token) {

    let email = req.body.email;
    let token_id = token;
    let session = req.sessionID;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "gmail",
    //  port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
          user: 'yjfs3012@gmail.com', 
          pass: '83695452',
        },
      });
  
    let mailOptions = {
        from: '"Epayco services" <epaycoservices@example.com>', // sender address
        to: email, // list of receivers
        subject: "Correo de confirmación ✔", // Subject line
        html : `
            <body>
                <h3> Por favor introduzca los siguentes valores en los campos requeridos para verificar su compra<h3>
                <br>
                <h4> Session: ${session}</4>
                <br>
                <h4>Token: ${token_id}</h4>
            </body>
        ` 	
    };
  
    
      // send mail with defined transport object
    transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
        resp.status(500).send({status : 500, message : err.message});
        }else{
            resp.status(200).send({status : 200, message : 'Se ha enviado un correo a su cuenta con un código sesión y un token, requeridos para verificar la compra'});
        }
    });

}

function getPurchases(req, resp) {

    PurchaseModel.find({}, (err, purchases) => {
        if (err) return resp.status(500).send({ message: `Error de solicitud ${err}` })
        if (!purchases) return resp.status(404).send({ message: 'Compras no encontradas' })

        resp.status(200).send({ status: 200, purchases })
    })
}

function confirmPruchase(req,resp){

    let token = req.body.token;
    let session = req.body.session;
    let id_user = req.body.id_user;
    let amount = req.body.amount

    let body = {
        confirm : true
    };

    PurchaseModel.findOneAndUpdate({ session_id : session, token : token }, body, {new : true} ,(err, purchase) => {
        if (err) return resp.status(500).send({ message: `Error de solicitud ${err}` });
  
        if(purchase != null){

            // update balance in the virtual account
            if(purchase.confirm == true){
                AccountModel.find({user : id_user},(error, account)=>{
        
                    if(account.length > 0){
                        
                        let new_account = account[0];
    
                        new_account.balance = (new_account.balance - amount);
                      
    
                        AccountModel.findOneAndUpdate({user : id_user}, new_account, { new :true }, (er, accountUpdate)=>{
                            if(er) return resp.status(500).send({ message : `Error al actualizar el saldo de la cuenta ${er}`});
            
                            resp.status(200).send({ status: 200, purchase: accountUpdate , message : 'Compra registrada con éxito'});
            
                        });
    
    
                    }else{
                        resp.status(200).send({status : 404 ,message : 'Cuenta virtual no encontrada'});
                    }
                    
    
                    
                });

            }else{
                resp.status(500 ).send({ status: 500, message : 'Error, la compra no ha sido confirmada'});
            }
            

            
        }else{
            resp.status(200).send({ status: 404, purchase: purchase , message : 'Error al confirmar la compra'});
        }
        
    })
}

module.exports = {
    registerPurchase,
    sendEmail,
    getPurchases,
    confirmPruchase
}
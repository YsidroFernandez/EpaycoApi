'use strict'

const { PurchaseModel, AccountModel } = require('../models')
const nodemailer = require("nodemailer");

function registerPurchase(req, resp) { 
    
    var cod = '';
    for(var i=0; i<6 ; i++){
        cod += Math.floor((Math.random() * (9 - 1 + 1)) + 1);
     }


    var purchase = new PurchaseModel(
        {
            amount: req.body.amount,
            session_id : req.sessionID,
            token : cod,
            user: req.body.user
        }
    );


    purchase.save((err, purchaseStored) => {
        if (err) resp.status(500).send({ status : 500, message: `Error to register the pruchase ${err}` })

        resp.status(200).send({ status: 200, card: purchaseStored, message: "Purchase registered successfully" });
    })
}

function sendEmail(req,resp) {

    let email = req.body.email;
    let token = req.body.token;
    let session = req.body.session;

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
        subject: "Purchase confirmation ✔", // Subject line
        html : `
            <body>
                <h2>Hello, please use this session code and token for confirm your purchase<h2>
                <br>
                <label>${session}</label>
                <br>
                <label>Token: ${token}</label>
            </body>
        ` 	
    };
  
    
      // send mail with defined transport object
    transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
        resp.status(500).send({status : 500, message : err.message});
        }else{
            resp.status(200).send({status : 200, message : 'Email  sended!'});
        }
    });

}

function getPurchases(req, resp) {

    PurchaseModel.find({}, (err, purchases) => {
        if (err) return resp.status(500).send({ message: `Failed request ${err}` })
        if (!purchases) return resp.status(404).send({ message: 'The purchases does not exist' })

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
        if (err) return resp.status(500).send({ message: `Failed request ${err}` });
        
        if(purchase != null){

            // update balance in the virtual account

            AccountModel.find({user : id_user},(error, account)=>{
        
                if(account.length > 0){
                    
                    let new_account = account[0];

                    new_account.balance = (new_account.balance - amount);
                  

                    AccountModel.findOneAndUpdate({user : id_user}, new_account, { new :true }, (er, accountUpdate)=>{
                        if(er) return resp.status(500).send({ message : `Error to recharge balance ${er}`});
        
                        resp.status(200).send({ status: 200, purchase: accountUpdate , message : 'successful purchase'});
        
                    });


                }else{
                    resp.status(200).send({status : 404 ,message : 'Virtual account not found'});
                }
                

                
            });

            
        }else{
            resp.status(200).send({ status: 404, purchase: purchase , message : 'purchase not found'});
        }
        
    })
}

module.exports = {
    registerPurchase,
    sendEmail,
    getPurchases,
    confirmPruchase
}
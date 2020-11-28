'use strict'

const { UserModel, AccountModel } = require('../models')
const Service = require('../service')


function singUp(req, resp) { 
    
    
    
    var user = new UserModel(
        {
            document: req.body.document,
            email: req.body.email,
            name: req.body.name,
            last_name: req.body.last_name,
            password: req.body.password,
            phone : req.body.phone
        }
    );



    user.save((err, userStored) => {
        if (err) resp.status(500).send({ status : 500, message: `Error al registrar el usuario ${err}` })
        
        if(userStored != null){
            userStored.password = undefined;
      

            var account = new AccountModel(
                {
                    user: userStored._id
                }
            );
        
        
            account.save((error, accountStored) => {
                if (error) resp.status(500).send({ status : 500, message: `Error al registrar la cuenta ${err}` })
        
                resp.status(200).send({ status: 200,user: userStored ,account: accountStored, message: "Usuario registrado satisfactoriamente" });
            });
        


            
        }
       
    })
}

function singIn(req, resp) {
    UserModel.find({ email: req.body.email }, (err, user) => {
        
        if (err) return resp.status(500).send({ status: 'error', message: err.status })
        if (user.length === 0) return resp.status(200).send({ status: '404', message: 'Usuario no existe' })

        if (user.length > 0) {
            var usuario = new UserModel(user[0]);

            const validPassword = usuario.comparePasswords(req.body.password);

            if (!validPassword) {
                return resp.status(200).send({
                    status: '400',
                    message: 'Contraseña incorrecta!'
                })
            }

            usuario.password = undefined;

            resp.status(200).send({
                status: 200,
                message: 'Inicio de sesión exitoso!',
                token: Service.createToken(user),
                user: usuario
            })
        }

    })
}

function getUsers(req, resp) {

    let usuarios = [];
    UserModel.find({}, (err, users) => {
        if (err) return resp.status(500).send({ message: `Error de solicitud ${err}` })
        if (!users) return resp.status(404).send({ message: 'Los usuarios no existen' })

        users.map((item) => {
            item.password = undefined;
            usuarios.push(item);
        });
        resp.status(200).send({ status: 200, usuarios })
    })
}

function getUserById(req, resp) {
    let userId = req.params.userId
    UserModel.findById(userId, (err, user) => {
        if (err) return resp.status(500).send({ message: `Error de solicitud ${err}` })
        if (!user) return resp.status(404).send({ message: `El usuario no existe` })


        user.password = undefined;
        resp.status(200).send({ status: 200, user })
    })
}

function updateUser(req, resp) {
    let userId = req.params.userId
    let update = req.body

    UserModel.findByIdAndUpdate(userId, update, (err, userUpdate) => {
        if (err) return resp.status(500).send({ message: `Error de solicitud ${err}` })
        userUpdate.password = undefined;
        resp.status(200).send({ status: 200, user: userUpdate })
    })
}


module.exports = {
    singUp,
    singIn,
    getUsers,
    getUserById,
    updateUser
}
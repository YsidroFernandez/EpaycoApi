'use strict'

const { UserModel } = require('../models')
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
        if (err) resp.status(200).send({ status : 500, message: `Error to create user ${err}` })
        userStored.password = undefined;
        resp.status(200).send({ status: 200, user: userStored, message: "User registered successfully" });
    })
}

function singIn(req, resp) {
    UserModel.find({ email: req.body.email }, (err, user) => {
        if (err) return resp.status(500).send({ status: 'error', message: err.status })
        if (user.length === 0) return resp.status(200).send({ status: '404', message: 'User do not exist!' })

        if (user.length > 0) {
            var usuario = new UserModel(user[0]);

            const validPassword = usuario.comparePasswords(req.body.password);

            if (!validPassword) {
                return resp.status(200).send({
                    status: '400',
                    message: 'Invalid Password!'
                })
            }

            usuario.password = undefined;

            resp.status(200).send({
                status: 200,
                message: 'login successful',
                token: Service.createToken(user),
                user: usuario
            })
        }

    })
}

function getUsers(req, resp) {

    let usuarios = [];
    User.find({}, (err, users) => {
        if (err) return resp.status(500).send({ message: `Failed request ${err}` })
        if (!users) return resp.status(404).send({ message: 'The users does not exist' })

        users.map((item) => {
            item.password = undefined;
            usuarios.push(item);
        });
        resp.status(200).send({ status: 200, usuarios })
    })
}

function getUserById(req, resp) {
    let userId = req.params.userId
    User.findById(userId, (err, user) => {
        if (err) return resp.status(500).send({ message: `Failed request ${err}` })
        if (!user) return resp.status(404).send({ message: `The user does not exist` })

        resp.status(200).send({ status: 200, user })
    })
}

function updateUser(req, resp) {
    let userId = req.params.userId
    let update = req.body

    User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
        if (err) return resp.status(500).send({ message: `Failed request ${err}` })

        resp.status(200).send({ status: 200, user: userUpdate })
    })
}

function updateUserByUsername(username) {
    User.findOneAndUpdate({ email: username }, { verified: true }, { new: true });
}

module.exports = {
    singUp,
    singIn,
    getUsers,
    getUserById,
    updateUser,
    updateUserByUsername
}
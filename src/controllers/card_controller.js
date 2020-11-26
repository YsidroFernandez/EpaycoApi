'use strict'

const { CardModel } = require('../models')


function saveCard(req, resp) { 
    
    console.log(req.sessionID)
    
    var card = new CardModel(
        {
            card_number: req.body.card_number,
            expiration_date: req.body.expiration_date,
            cvv: req.body.cvv,
            user: req.body.user,
        }
    );


    card.save((err, cardStored) => {
        if (err) resp.status(500).send({ status : 500, message: `Error al registrar la tarjeta ${err}` })
        resp.status(200).send({ status: 200, card: cardStored, message: "Tarjeta registrada satisfactoriamente" });
    })
}



function getCards(req, resp) {

    CardModel.find({}, (err, cards) => {
        if (err) return resp.status(500).send({ message: `Error de solicitud ${err}` })
        if (!cards) return resp.status(404).send({ message: 'Tarjetas no encontradas' })

        resp.status(200).send({ status: 200, cards })
    })
}

function getCardById(req, resp) {
    let cardId = req.params.cardId
    CardModel.findById(cardId, (err, card) => {
        if (err) return resp.status(500).send({ message: `Error de solicitus ${err}` })
        if (!card) return resp.status(404).send({ message: `Tarjeta no encontrada` })

        resp.status(200).send({ status: 200, card })
    })
}

function updateCard(req, resp) {
    let cardId = req.params.cardId
    let update = req.body

    CardModel.findByIdAndUpdate(cardId, update, (err, cardUpdate) => {
        if (err) return resp.status(500).send({ message: `Error de solicitud ${err}` })

        resp.status(200).send({ status: 200, card: cardUpdate, message : "Tarjeta actualizada correctamente" })
    })
}

function deleteCard(req, resp) {
    let cardId = req.params.cardId

    CardModel.findOneAndDelete(cardId,(err, card) => {
        if (err) return resp.status(500).send({ message: `Error de solicitud ${err}` })

        resp.status(200).send({ status: 200, card: card , message : "Tarjeta eliminada"});
    })
}

module.exports = {
    saveCard,
    getCards,
    getCardById,
    updateCard,
    deleteCard
}
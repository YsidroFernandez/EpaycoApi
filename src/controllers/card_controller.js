'use strict'

const { CardModel } = require('../models')


function saveCard(req, resp) { 
    
    
    
    var card = new CardModel(
        {
            card_number: req.body.card_number,
            expiration_date: req.body.expiration_date,
            cvv: req.body.cvv,
            user: req.body.user,
        }
    );


    card.save((err, cardStored) => {
        if (err) resp.status(500).send({ status : 500, message: `Error to register card ${err}` })
        resp.status(200).send({ status: 200, card: cardStored, message: "Card registered successfully" });
    })
}



function getCards(req, resp) {

    CardModel.find({}, (err, cards) => {
        if (err) return resp.status(500).send({ message: `Failed request ${err}` })
        if (!users) return resp.status(404).send({ message: 'The cards does not exist' })

        resp.status(200).send({ status: 200, cards })
    })
}

function getCardById(req, resp) {
    let cardId = req.params.cardId
    CardModel.findById(cardId, (err, card) => {
        if (err) return resp.status(500).send({ message: `Failed request ${err}` })
        if (!card) return resp.status(404).send({ message: `The card does not exist` })

        resp.status(200).send({ status: 200, card })
    })
}

function updateCard(req, resp) {
    let cardId = req.params.cardId
    let update = req.body

    CardModel.findByIdAndUpdate(cardId, update, (err, cardUpdate) => {
        if (err) return resp.status(500).send({ message: `Failed request ${err}` })

        resp.status(200).send({ status: 200, user: cardUpdate, message : "card update suceessfully" })
    })
}

function deleteCard(req, resp) {
    let cardId = req.params.Id

    CardModel.findOneAndDelete(cardId,(err, card) => {
        if (err) return resp.status(500).send({ message: `Failed request ${err}` })

        resp.status(200).send({ status: 200, card: card , message : "Card removed"})
    })
}

module.exports = {
    saveCard,
    getCards,
    getCardById,
    updateCard,
    deleteCard
}
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('../config')
const { compareSync, hashSync, genSaltSync } = require('bcryptjs')

var AccountSchema = Schema({
    virtual_number: { type: String },
    card: [
        {
            type: Schema.Types.ObjectId,
            ref: 'card',
            unique: true,
            autopopulate: true
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique  : true,
        autopopulate: { select: ['email', 'name', 'last_name'] }
    },
    balance: { type: Number }

});

AccountSchema.pre("save", async function (next) {
    const account = this;

    let virtual = '';
    for (var i = 0; i < 16; i++) {
        virtual += Math.round(Math.random()* (20- i) + i );
    }

    account.virtual_number = virtual;
    next();

});


AccountSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('account', AccountSchema);

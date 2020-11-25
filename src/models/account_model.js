'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('../config')
const { compareSync,hashSync,genSaltSync } = require('bcryptjs')

var AccountSchema = Schema({
    card : [
        {
            type: Schema.Types.ObjectId, 
            ref: 'user',
            required : true,
            autopopulate : { select: ['email','name','last_name']}
        }
    ],
    user : {
        type: Schema.Types.ObjectId, 
        ref: 'user',
        required : true,
        autopopulate : { select: ['email','name','last_name']}
    },
    balance : { type : Number}
  
});


AccountSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('account',AccountSchema);

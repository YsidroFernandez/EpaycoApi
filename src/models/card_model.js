'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('../config')
const { compareSync,hashSync,genSaltSync } = require('bcryptjs')

var CardSchema = Schema({
    card_number: { type: String, unique: true, lowercase:true, required : true,  minlegth:[ 16, "must contain at least 16 characters"]  },
    expiration_date: { type: String, unique: true, lowercase:true, required : true},
    cvv: {type : String, required :true},
    user : {
        type: Schema.Types.ObjectId, 
        ref: 'user',
        required : true,
        autopopulate : { select: ['email','name','last_name'] }
    }
   
});


CardSchema.pre("save",async function (next){
    const card = this;

    if(!card.isModified("card_number")){
        return next();
    }

    const salt = genSaltSync(10);
    const hashedCardNumber = hashSync(card.card_number,salt);

    card.card_number = hashedCardNumber;
    next();

});

CardSchema.pre("save",async function (next){
    const card = this;

    if(!card.isModified("expiration_date")){
        return next();
    }

    const salt = genSaltSync(10);
    const hashedDate = hashSync(card.expiration_date,salt);

    card.expiration_date = hashedDate;
    next();

});

CardSchema.pre("save",async function (next){
    const card = this;

    if(!card.isModified("cvv")){
        return next();
    }

    const salt = genSaltSync(10);
    const hashedCvv = hashSync(card.cvv,salt);

    card.cvv = hashedCvv;
    next();

});


CardSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('card',CardSchema);

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema


var PurchaseSchema = Schema({
    amount : { type: Number, required : true},
    session_id: { type: String, unique: true, required : true},
    token : { type: String , required:true },
    date: { type: Date, default: Date.now()},
    user : {
        type: Schema.Types.ObjectId, 
        ref: 'user',
        required : true,
        autopopulate : { select: ['email','name','last_name'] }
    },
    confirm : {type : Boolean, default : false}
});

PurchaseSchema.methods.compareToken = function(session,token){
    const purchase = this;
    
    if(session == purchase.session_id && token == purchase.token){
        return true;
    }

    return false;

}




module.exports = mongoose.model('purchase',PurchaseSchema);

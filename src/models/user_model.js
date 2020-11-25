'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('../config')
const { compareSync,hashSync,genSaltSync } = require('bcryptjs')

var userSchema = Schema({
    email: { type: String, unique: true, lowercase:true, required : true},
    name: {type : String, required :true},
    last_name: {type : String, required : true},
    password: { type: String,minlegth:[ 5, "debe tener almenos 5 caracteres"], required : true},
    document: String,
    phone : { type: String, required : true },
    singUpDate: { type: Date, default: Date.now()},
    lastLogin: Date,
    
   
});


userSchema.methods.toJson = function(){
    let user = this.toObject();
    delete user.password;
    return user;
};


userSchema.methods.comparePasswords = function(password){
    const user = this;
    return compareSync(password, user.password);
}

userSchema.pre("save",async function (next){
    const user = this;

    if(!user.isModified("password")){
        return next();
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(user.password,salt);

    user.password = hashedPassword;
    next();
});




module.exports = mongoose.model('user',userSchema);

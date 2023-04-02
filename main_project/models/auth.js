const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const userschema=new Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phonenumber:{
        type:String,
        required:true,
    },
    geolocation:{
        type:String,
        required:true,
    },
    secqn:{
        type:String,
        required:true,
    },
    secqnvalue:{
        type:String,
        required:true,
    },
    secqn1:{
        type:String,
        required:true,
    },
    secqnvalue1:{
        type:String,
        required:true,
    },

},{timestamps:true});
const user=mongoose.model('users',userschema);
module.exports=user;
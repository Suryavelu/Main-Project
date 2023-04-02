const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const userschema=new Schema({
    uid:{
        type:String,
        required:true,
    },
    geolocation:{
        type:String,
        required:true,
    }

},{timestamps:true});
const loc=mongoose.model('locations',userschema);
module.exports=loc;
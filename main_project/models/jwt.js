const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const userschema=new Schema({
    jwt:{
        type:String,
        required:true,
    },
    validate:{
        type:String,
        required:true,
    }

},{timestamps:true});
const jwtschema=mongoose.model('jwt',userschema);
module.exports=jwtschema;
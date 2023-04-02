const Auth=require('../models/auth');
const Location=require('../models/location');
const hash=require('../Hashing')
var gen = require('random-seed');
const jwt=require('jsonwebtoken')
const CryptoJS = require('crypto-js');
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')
const Jwt=require('../models/jwt');
const jwt_decode = require('jwt-decode');



let jwttoken;
let id;
let mkid;
require('dotenv').config()
const key = 'mfaauth1234@';

function encrypt(data) {
  const encrypted = CryptoJS.AES.encrypt(data, key);
  return encrypted.toString();
}


function decrypt(data) {
  const decrypted = CryptoJS.AES.decrypt(data, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
}
const home=(req,res)=>{
    
      
    res.render('login',{unique:makeid(6),correct:true});
}
const token=(id)=>{
    return jwt.sign({id},'main_project',{
        expiresIn:1000*60*60*24
    })
}
const register=(req,res)=>{
    req.body.password=decrypt(req.body.password)
    req.body.password=hash(req.body.password)
     console.log(req.body)
    const auth= new Auth(req.body);
  auth.save()
    .then(result => {
        console.log(result)
        let h=req.body.geolocation.split(",")
        id=result._id;
        jwttoken=token(result._id)
        res.cookie('jwt',jwttoken,{httponly:true})
      res.render('otp',{location:h[0],phonenumber:req.body.phonenumber});
    })
    .catch(err => {
      console.log(err);
      res.redirect('/')
    });
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const signup=(req,res)=>{

    res.render('register',{sec:"",unique:makeid(6)});
}
const login=(req,res)=>{
    //console.log(req.body)
    req.body.password=decrypt(req.body.password)
    //console.log(req.body)
    req.body.password=hash(req.body.password)
    //console.log(req.body.password)
    Auth.find({username:req.body.username,password:req.body.password},function (err, docs) {
        if (err){
            console.log(err);
            res.render('404')
        }
        else{
            //console.log(docs)
            if(docs.length===0)
            {
                res.render('login',{correct:false,unique:makeid(6)})
            }
            else{
                id=docs[0]._id;
                let g=docs[0].geolocation.split(",")
            let f=req.body.geolocation.split(",")
            let dis=distance(parseFloat(g[0]),parseFloat(g[1]),parseFloat(f[0]),parseFloat(f[1]))
            console.log(dis)
            if(dis<50){
       
                jwttoken=token(docs[0]._id)
                res.cookie('jwt',jwttoken,{httponly:true})
                res.render('otp',{location:f[0],phonenumber:docs[0].phonenumber})
            }
            else{
                res.render('404')
            }
           
            }
            
        }
        
    })
    
}
const genotp=(req,res)=>{
                var ot=gen.create(req.body.location)(1000000)
                const accountSid = process.env.TWILIO_ACCOUNT_SID;
                const authToken = process.env.TWILIO_AUTH_TOKEN;
                const client = require('twilio')(accountSid, authToken);

                client.messages
                .create({
                    body: 'Your OTP for registering the account is '+ot,
                    from: '+15134509830',
                    to: "+91"+req.body.phonenumber
                })
                .then(message => {
                    console.log(ot)
                    console.log(message.sid)
                    console.log(encrypt(ot.toString()))
                    res.json({otp:encrypt(ot.toString())})
                });
}
const otpfunction= (req,res)=>{
   
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    var digits = '0123456789';
    OTP = '';
    console.log(process.env.TWILIO_ACCOUNT_SID)
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    client.messages
      .create({
        body: 'Your OTP for registering the account is '+OTP,
        from: '+15134509830',
        to: '+91'+req.body.phonenumber
      })
      .then(message => {console.log(message.sid)
        res.json({otp:OTP})});
}
const security =(req,res)=>{
    res.render('security')
}
const change=(req,res)=>{
    req.body.password=decrypt(req.body.password)
    req.body.password=hash(req.body.password)
    Auth.updateOne({email:req.body.email},{password:req.body.password},(err,docs)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(docs)
            res.render('login',{unique:makeid(6),correct:true})
        }
    })
}
const forgot=(req,res)=>{
    Auth.find(req.body,function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
            if(docs.length!==0){
                qn1=docs[0].secqn
                qn2=docs[0].secqn1
                vl1=docs[0].secqnvalue
                vl2=docs[0].secqnvalue1
                res.json({qn1:qn1,qn2:qn2,vl1:vl1,vl2:vl2,val:true})
            }
            else{
                res.json({val:false}) 
            }
           
        }
    })
}
const fetchlocation=(req,res)=>{
    Location.find(req.body,(err,docs)=>{
        if(err){
            res.json({find:false})
        }
        else{
            console.log(docs)
            if(docs.length===0){
                res.json({find:false})
            }
            else{
                res.json({geolocation:docs[0].geolocation,find:true})

            }
            
        }
    })
}
function distance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		return dist*1609.344;
	}
}

const validateUser=(req,res)=>{
    console.log(req.body)
    const jwtschema= new Jwt(req.body);
    jwtschema.save()
    .then(result => {
        console.log(result)
        
    })
    .catch(err => {
      console.log(err);
     
    });
    res.json({success:true})
}
const welcome=(req,res)=>{
    console.log(req.cookies.jwt)
    mkid=makeid(7);
    var decoded = jwt_decode(req.cookies.jwt);
    //console.log("Decoded   ",decoded)
    Auth.findById({_id:decoded.id},(err,docs)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            console.log(docs)
           
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: '1905039cse@cit.edu.in',
                  pass: 'ranvi40700'
                }
              });
              const handlebarOptions = {
                viewEngine: {
                    partialsDir: path.resolve('./views/'),
                    defaultLayout: false,
                },
                viewPath: path.resolve('./views/'),
            };
            transporter.use('compile', hbs(handlebarOptions))
        
              var mailOptions = {
                from:"1905039cse@cit.edu.in",
                            to:docs.email,
                             subject:"Notifying the user",
                        
                             template:'email',
                             context:{
                                mkid:mkid
                            }
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
        
        }
    })
    
    
    

    res.render('welcome',{id:mkid})
}

const logout =(req,res)=>{
    Jwt.find(req.body,(err,result)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            if(result.length==0)
            {
                res.json({hitapi:true,validate:"no"})
            }
            else{
                
                if(result[0].validate=="no"){
                    res.cookie('jwt',"",{httponly:true})
                    res.json({hitapi:false,validate:"no"})
                }
                else{
                    res.json({hitapi:false,validate:result[0].validate})
                }
                
            }
        }
    })

}

module.exports={
    home,
    register,
    signup,
    login,
    otpfunction,
    genotp,
    security,
    forgot,
    change,
    fetchlocation,
    welcome,
    validateUser,
    logout
}
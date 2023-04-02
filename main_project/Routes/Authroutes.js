const express=require('express');
const authcontroller=require('../controllers/Authcontroller');
const { Auth } = require('../Middleware/authmiddleware')

const router=express.Router();
router.get('/',authcontroller.home);
router.get('/signup',authcontroller.signup);
router.post('/register',authcontroller.register)
router.post('/login',authcontroller.login)
router.post('/otpfunction',authcontroller.otpfunction)
router.post('/genotp',authcontroller.genotp)
router.get('/security',authcontroller.security)
router.post('/forgot',authcontroller.forgot)
router.post('/change',authcontroller.change)
router.post('/fetchlocation',authcontroller.fetchlocation)
router.get('/welcome',[Auth],authcontroller.welcome)
router.post('/validateUser',authcontroller.validateUser)
router.post('/logout',authcontroller.logout)
module.exports=router;
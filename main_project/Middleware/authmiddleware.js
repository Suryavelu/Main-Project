const jwt=require('jsonwebtoken')

const Auth =(req,res,next) =>{
    const token = req.cookies.jwt
    if(token)
    {

        jwt.verify(token,"main_project",(err,decodedtoken)=>{
            if(err)
            {
                console.log(err)
                res.redirect("/")
            }
            else{
                console.log(decodedtoken)
                next();
            }
        })
    }
    else{
        res.redirect("/")
    }
}

module.exports = { Auth }
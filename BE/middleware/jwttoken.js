
const jwt=require('jsonwebtoken')
const SECRET_KEY = 'your_secret_key';


const AuthenticationJwt=async(req,res,next)=>{
   const headerinfo=req.headers['authorization']
    if(!headerinfo||!headerinfo.startsWith('Bearer'))
    {
        res.status(404).json({unAuthorixtion:'token not recevied'})
    }    const token=headerinfo.split(" ")[1]
   try{
    const decode =jwt.verify(token, SECRET_KEY)
    req.userId =decode.userId;
    next();
    }catch(err){res.status(500).json({Message:'Token Expried'})}
}

module.exports= AuthenticationJwt
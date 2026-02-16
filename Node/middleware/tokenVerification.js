const jwt  = require('jsonwebtoken')
const{response} = require("./../helper")

module.exports = {
    verifyToken: (req,res,next) => {
        try{
            const authHeader = req.headers.authorization //Bearer <token>
            if(!authHeader)
                return response(res,400,false,`token is missing`,[])
           
            const token = authHeader.split(' ')[1];
            req.token = token
            if(token){
                const verify = jwt.verify(token,process.env.JWT_SECRET)
                req.user = verify
                next();
            }
            
        }
        catch(error){
            return response(res,401,false,`You are not authorised`,[])
        }
    },
}
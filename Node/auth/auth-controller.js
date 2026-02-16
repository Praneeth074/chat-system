
const path = require("path");
const jwt = require('jsonwebtoken')
const body = require('body-parser');
const { loginUser, registerUser} = require('./auth-service');
const{validatePayload,response} = require("./../helper")

// async function hashPassword(plainPassword){
//     const saltRounds = 10
//     const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
//     return hashedPassword;

// }
// async function comparePassword(plainPassword, hashedPassword) {
//   return await bcrypt.compare(plainPassword, hashedPassword);
// }
module.exports = {
    login: async(req,res)=>{
        try{
            const data = req.body;
            var body = {
                email: data.email,
                password: data.password
            }
            const error = validatePayload(body,[])
            if (error)
                return response(res,400,false,error,[]);
            var payload = {
                email: data.email.trim(),
                password: data.password
            }
            loginUser(payload,async(err,result) => {
                if(err){
                    msg = (err && err.message) ? err.message : "Internal Server Error"
                    return response(res,500,false,msg,[])
                }
                
                const email = result?.rows?.[0]?.email
                if(!email)
                    return response(res,400,false, `email: ${payload.email}is not exist`,[])

                const token = jwt.sign (
                    {
                        ID : result?.rows?.[0]?.id,
                        email : email,
                        username: result?.rows?.[0]?.username,
                        displayname : result?.rows?.[0]?.display_name
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    }
                )
                const data = {
                    result: result.rows[0],
                    token : token
                }
                return response(res,200,true,`Login successful`,data)
            })
        }
        catch(err){
            msg = (err && err.message) ? err.message : "Internal Server Error"
            return response(res,500,false,msg,[]);
        }
    },
    register: async(req,res) => {
        try{
            const data = req.body;
            const body = {
                username: data.username,
                display_name: data.display_name,
                email: data.email,
                password: data.password
            };
            const error = validatePayload(body, []);
            if (error)
                return response(res, 400, false, error, []);
            const payload = {
                username: data.username.trim(),
                display_name: data.display_name.trim(),
                email: data.email.trim(),
                status: 'active',
                password: data.password
            };
            registerUser(payload, (err, result) => {
                if (err) {
                    const msg = (err && err.message)? err.message: "Internal Server Error";
                    return response(res, 500, false, msg, []);
                }
                return response(
                    res,
                    200,
                    true,
                    "User registered successfully",
                    result
                );
            });
        }
        catch(err){
            msg = (err && err.message) ? err.message : "Internal Server Error"
            return response(res,500,false,msg,[]);
        }
    }
}
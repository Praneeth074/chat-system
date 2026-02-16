function response(res,code,val,msg,result){
    return res.status(code).json({
        success: val,
        message: msg,
        data: result || []
    })
}

module.exports = {
    emailValidation: (req,res,next)=>{
        const email = req.body.email || req.body.email_id || req.body.email_address;
        const cleanedEmail = String(email).trim();
        emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
        if(!emailRegex.test(cleanedEmail))
            return response(res,400,false,`Invalid email`,[]);
        next()
    },

    phoneValidation: (req,res,next) => {
        var phn_number = req.body.phone || req.body.phone_number || req.body.number
        var phone_number = Number(phn_number).trim();
        phone_regex = /^\d{10}$/
        if(!phone_regex.test(phone_number)){
            return response(res,400,false,`Invalid phone number`,[])
        }
        next()
    },
    dobValidation:(req,res,next)=>{
        var dob = new Date(req.body.dob)
        if(isNaN(dob.getTime()))
            return response(res,400,false,`Invalid date`,[]) 
        
        dob_regex = /^\d{4}-\d{2}-\d{2}$/
        if(!dob_regex.test(dob)){
            return response(res,400,false,`Invalid dob format`,[])
        }
        next()
    }

}
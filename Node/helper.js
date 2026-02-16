

module.exports = {
    response:(res,code,val,msg,result)=>{
        return res.status(code).json({
            success: val,
            message: msg,
            data: result || [],
        })
    },
    validatePayload:  (body,numFields = []) => {
        numFields = Array.isArray(numFields) ? numFields : [];
        var payload = body 
        for (let key in payload){
            if(payload[key] === undefined || payload[key] === null){
                return `${key} is missing`
            }
            if(typeof payload[key] === 'string' && payload[key].trim() === ''){
                return `${key} is required`
                
            }
            if(key === "dob"){
                let date = new Date(payload[key])
                if(isNaN(date.getDate())){
                    return `${key} is not a date`
                }
            }
            else{
                if(numFields.includes(key)){
                    let value = Number(payload[key])
                    if(Number.isNaN(value)){
                        return `${key} is not a number`
                    }
                }
            } 
        }
        return null
    },
    
}

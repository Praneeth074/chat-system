const {login,register,validateOTP,changePassword,resendOtpOnRequest} = require("./auth-controller")
const{emailValidation,} = require("./../middleWare/regexValidation")
const{verifyToken,} = require("./../middleWare/tokenVerification")
const router = require("express").Router()

router.post('/login', emailValidation, login)
router.post('/register', emailValidation, register)
// router.post('/forgotpassword', forgotPassword)
// // router.post('/validateotp', verifyToken, validateOTP)
// // router.post('/changepassword',  verifyToken, changePassword)
// // router.patch('/resendotp', verifyToken, resendOtpOnRequest)


module.exports = router;
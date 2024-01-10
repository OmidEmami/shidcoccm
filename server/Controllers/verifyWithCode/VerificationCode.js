import Users from "../../Models/Users.js";
import VerificationCodes from "../../Models/VerificationCodes.js";
import moment from 'jalali-moment' ;
import bcrypt from "bcrypt"
export const verifyPhoneNumber = async(req,res)=>{
    const randomCode = Math.floor(Math.random() * 100000);
    const realRandomCode = randomCode.toString().padStart(5, '0');
    try{
        const doubleCheck = await VerificationCodes.update({
            isExpired : true
        },{
            where:{
                PhoneNumber : req.body.PhoneNumber
            }
        })
        const response = await VerificationCodes.create({
            PhoneNumber: req.body.PhoneNumber,
            VerifyCode : realRandomCode,
            isExpired: false,
            CreatedDate : moment().locale('fa').format('YYYY-MM-DD HH:mm:ss')
        })
        const expireVerifyCode = async()=>{
            try{
                const expireResponse = await VerificationCodes.update({
                    isExpired : true
                },{
                    where:{
                        PhoneNumber : req.body.PhoneNumber,
                        VerifyCode : realRandomCode,
                        isExpired:false
                    }
                })
            }catch(error){

            }
            
        }
        setTimeout(expireVerifyCode, 180000);
        
        res.json(response)
        }catch(error){

        }
    }
export const checkVerificationCode = async(req,res)=>{

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.Password, salt);
    try{
        const response = await VerificationCodes.findAll({
            where:{
            PhoneNumber: req.body.PhoneNumber,
            VerifyCode: req.body.Code,
            isExpired: false,
            }            
        })
        // console.log(response[0].dataValues.VerifyCode)
        if(response[0].dataValues.VerifyCode=== req.body.Code){
            const expireCode = await VerificationCodes.update({
                isExpired:true
            },{
               where:{
                PhoneNumber: req.body.PhoneNumber,
                VerifyCode: req.body.Code,
             
            }})
            
            const signUpNewUser = await Users.create({
                
                Phone:req.body.PhoneNumber,
                FullName:req.body.FullName,
                Email:req.body.Email,
                Rule:req.body.Rule,
                Province:req.body.Province,
                Password:hashPassword
            })          
            
            res.json("ok")
        }else{
            res.json("notOk")
        }
    }catch(error){

    }
}
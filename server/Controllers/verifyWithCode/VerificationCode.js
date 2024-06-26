import Users from "../../Models/Users.js";
import VerificationCodes from "../../Models/VerificationCodes.js";
import moment from 'jalali-moment' ;
import bcrypt,{compare} from "bcrypt"
import request from 'request';

import jwt from "jsonwebtoken";
export const verifyPhoneNumber = async(req,res)=>{
    const randomCode = Math.floor(Math.random() * 100000);
    const realRandomCode = randomCode.toString().padStart(5, '0');
    try{
        const doubleCheck = await VerificationCodes.update({
            isExpired : true
        },{
            where:{
                PhoneNumber : req.body.PhoneNumber,
                isExpired:false
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
        const sendSms = async() =>{
            request.post({
                url: 'http://ippanel.com/api/select',
                body: {
        "op":"pattern",
        "user":"09129348033",
        "pass":"Shidco@2024",
        "fromNum":"+983000505",
        "toNum":`${req.body.PhoneNumber}`,
        "patternCode":"dn6ccgatae9lse6",
        "inputData":[
                {"code":realRandomCode},
            	
            ]
    },
                json: true,
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
    //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE
                    console.log(response.body);
                } else {
    console.log("whatever you want");
                
                }
            });
        }
        await sendSms();
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
        if(response.length !== 0){
        if(response[0].dataValues.VerifyCode === req.body.Code || response.length !== 0){
            const expireCode = await VerificationCodes.update({
                isExpired:true
            },{
               where:{
                PhoneNumber: req.body.PhoneNumber,
                VerifyCode: req.body.Code,
             
            }})
            const checkRegistrantEmail = await Users.findAll({
                where:{
                    Email : req.body.Email
                }
            })
            const checkRegistrantPhone = await Users.findAll({
                where:{
                    Phone : req.body.PhoneNumber,
                }
            })
            
            if(checkRegistrantEmail.length !== 0 || checkRegistrantPhone.length !== 0){
                res.status(400).json({msg:"already registered"})
            }else{
            const signUpNewUser = await Users.create({
                
                Phone:req.body.PhoneNumber,
                FullName:req.body.FullName,
                Email:req.body.Email,
                Rule:req.body.Rule,
                Province:req.body.Province,
                Password:hashPassword,
                IsConfirmed: false,
                Type:req.body.Type
            })          
        
            res.json("ok")
        }
        }else{
            res.status(400).json({msg:"not ok"})
        }
    }else{
            res.status(400).json({msg:"not ok"})
    }

    }catch(error){
        console.log(error)
    }
}
export const sendLoginVerifyCode = async (req,res) =>{
    const randomCode = Math.floor(Math.random() * 100000);
    const realRandomCode = randomCode.toString().padStart(5, '0');
    try{
        const response = await Users.findAll({
            where:{
                Phone:req.body.PhoneNumber,
                isConfirmed : true
            }
        })
        if(response.length !== 0 && response[0].dataValues.Phone === req.body.PhoneNumber){
            const expirePastCodes = await VerificationCodes.update({
                isExpired: true
            },{
                where:{
                    PhoneNumber: req.body.PhoneNumber,
                    isExpired:false,
                }
            })
            const newVerify = await VerificationCodes.create({
                PhoneNumber: req.body.PhoneNumber,
                isExpired:false,
                VerifyCode:realRandomCode,
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
            res.json({msg:'codeSent'})
        }else{
            res.status(400).json({msg:"phoneNotFound"})
        }
    }catch(error){
            res.status(400).json({msg:"noConnection"})
    }
}
export const loginWithCode = async (req,res) =>{
    
    try{
        const findCode = await VerificationCodes.findAll({
            where:{
                PhoneNumber: req.body.PhoneNumber,
                isExpired:false,
                VerifyCode:req.body.VerifyCode
                
            }
        })
        if(findCode.length !== 0 && findCode[0].dataValues.VerifyCode === req.body.VerifyCode && findCode[0].dataValues.PhoneNumber === req.body.PhoneNumber){
            const expireCode = await VerificationCodes.update({
                isExpired : true
            },{
                where:{
                PhoneNumber: req.body.PhoneNumber,
                isExpired:false,
                VerifyCode:req.body.VerifyCode
                }
            })
            const findUserToSign = await Users.findAll({
                where:{
                    Phone : req.body.PhoneNumber,
                    IsConfirmed: true
                }
            })
            const userId = findUserToSign[0].id;
            const name = findUserToSign[0].FullName;
            const email = findUserToSign[0].Email;
            const phone = findUserToSign[0].Phone
            const type = findUserToSign[0].Type;
            const rule = findUserToSign[0].Rule;
            const province = findUserToSign[0].Province;
            
            const accessToken = jwt.sign({userId, name, email,phone, type,rule,province}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '15s'
            });
            
            const refreshToken = jwt.sign({userId, name, email,phone, type,rule,province}, process.env.REFRESH_TOKEN_SECRET,{
                expiresIn: '1d'
            });
            
            await Users.update({RefreshToken: refreshToken},{
                where:{
                    id: userId
                }
            });
            
            res.cookie('refreshToken', refreshToken,{
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            
            
            
            res.json({access: accessToken, msg:"verified", user:findUserToSign})
        }else{
            res.json({msg:"notverified"})
        }
        
    }catch(error){
        res.status(400).json({msg:"notverified"})
    }

}
// export const loginUser = async(req,res) =>{
   
//     try{
        
        
        
//         const match = await bcrypt.compare(pass, response[0].Password);
        
//         if(!match) return res.status(400).json({msg: "Wrong Password"});
//         if(response[0].AccessType === null) res.status(400).json({msg:"not auth"})
//         const userId = response[0].id;
//         const name = response[0].FullName;
//         const email = response[0].UserName;
//         const phone = response[0].Phone
//         const accessType = response[0].AccessType
//         const accessToken = jwt.sign({userId, name, email,phone, accessType}, process.env.ACCESS_TOKEN_SECRET,{
//             expiresIn: '15s'
//         });
//         const refreshToken = jwt.sign({userId, name, email,phone, accessType}, process.env.REFRESH_TOKEN_SECRET,{
//             expiresIn: '1d'
//         });
        
//         await AdminUsers.update({RefreshToken: refreshToken},{
//             where:{
//                 id: userId
//             }
//         });
        
//         res.cookie('refreshToken', refreshToken,{
//             httpOnly: true,
//             maxAge: 24 * 60 * 60 * 1000
//         });
        
     
//         res.json({ accessToken });
        
    
//     }catch(error){
//         res.status(404).json({msg:"Email not found"});
    
//     }
// }
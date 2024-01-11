import Users from "../../Models/Users.js";
import VerificationCodes from "../../Models/VerificationCodes.js";
import moment from 'jalali-moment' ;
import bcrypt,{compare} from "bcrypt"
import { constants } from "fs/promises";

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
        if(response.length !== 0){
        if(response[0].dataValues.VerifyCode === req.body.Code || response.length !== 0){
            const expireCode = await VerificationCodes.update({
                isExpired:true
            },{
               where:{
                PhoneNumber: req.body.PhoneNumber,
                VerifyCode: req.body.Code,
             
            }})
            const checkRegistrant = await Users.findAll({
                where:{
                    Phone : req.body.PhoneNumber,
                    Email : req.body.Email
                }
            })
            
            if(checkRegistrant.length !== 0 ? (checkRegistrant[0].dataValues.Email === req.body.Email || checkRegistrant[0].dataValues.Phone === req.body.PhoneNumber) : false){
                res.json({msg:"already registered"}).status(400)
            }else{
            const signUpNewUser = await Users.create({
                
                Phone:req.body.PhoneNumber,
                FullName:req.body.FullName,
                Email:req.body.Email,
                Rule:req.body.Rule,
                Province:req.body.Province,
                Password:hashPassword,
                IsConfirmed: false,
                Type:'Customer'
            })          
        
            res.json("ok")
        }
        }else{
            res.json({msg:"not ok"}).status(400)
        }
    }else{
            res.json({msg:"not ok"}).status(400)
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
            const newVerify = await VerificationCodes.create({
                PhoneNumber: req.body.PhoneNumber,
                isExpired:false,
                VerifyCode:realRandomCode

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
            res.json({msg:"phoneNotFound"}).status(400)
        }
    }catch(error){
            res.status(400).json({msg:"noConnection"})
    }
}
export const loginWithCode = async (req,res) =>{
    // const user = req.body.UserName;
    // const pass = req.body.Password;
    // const responseEmail = await Users.findAll({
    //     where:{
    //         Email :req.body.UserName
    //     }
    // })
    // console.log(responseEmail)
    // if(responseEmail.length !== 0){
    //     const match = await bcrypt.compare(pass, responseEmail[0].Password);
    // }
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
            res.json({msg:"verified"})
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
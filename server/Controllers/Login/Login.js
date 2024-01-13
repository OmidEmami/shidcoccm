import Users from "../../Models/Users.js";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
// 
        
//         if(!match) return res.status(400).json({msg: "Wrong Password"});
//         if(response[0].AccessType === null) res.status(400).json({msg:"not auth"})
export const loginNormal = async (req,res)=>{
    try{
        const findEmail = await Users.findAll({
            where:{
                Email : req.body.UserName
            }
        })
        const findPhone = await Users.findAll({
            where:{
                Phone : req.body.UserName
            }
        })
        
        if(findEmail.length > 0){
            const match = await bcrypt.compare(req.body.Password, findEmail[0].Password);
            if(!match) return res.status(400).json({msg: "Wrong Password"});
            const userId = findEmail[0].id;
            const name = findEmail[0].FullName;
            const email = findEmail[0].Email;
            const phone = findEmail[0].Phone
            const type = findEmail[0].Type;
            const rule = findEmail[0].Rule;
            const province = findEmail[0].Province;
            
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
            
            
            res.json({access: accessToken, msg:"ok" });
        }else if(findPhone.length >0){
            const match = await bcrypt.compare(req.body.Password, findPhone[0].Password);
            if(!match) return res.status(400).json({msg: "Wrong Password"});
            const userId = findPhone[0].id;
            const name = findPhone[0].FullName;
            const email = findPhone[0].Email;
            const phone = findPhone[0].Phone
            const type = findPhone[0].Type;
            const rule = findPhone[0].Rule
            const province = findPhone[0].Province;
            const password = findPhone[0].Password
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
            
         
            res.json({access: accessToken, msg:"ok" });
        }else{
            res.status(400).json({msg: "user not found"});
        }
    }catch(error){

    }
}

// const userId = response[0].id;
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
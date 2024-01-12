import { response } from "express";import Users from "../../Models/Users.js";
import bcrypt, { compare } from "bcrypt";
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
            res.json("ok")
        }else if(findPhone.length >0){
            const match = await bcrypt.compare(req.body.Password, findPhone[0].Password);
            if(!match) return res.status(400).json({msg: "Wrong Password"});
            res.json("ok")
        }else{
            res.status(400).json({msg: "user not found"});
        }
    }catch(error){

    }
}
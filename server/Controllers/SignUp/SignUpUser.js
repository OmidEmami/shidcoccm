import Users from "../../Models/Users.js";
import bcrypt from "bcrypt"
export const registerNewUser = async (req,res)=>{
    try{
       
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.Password, salt);
        const checkDataBaseEmail = await Users.findAll({
            where:{
                Email : req.body.Email
            }
        })
        const checkDataBasePhone = await Users.findAll({
            where:{
                Phone:req.body.Phone
            }
        })
        if(checkDataBaseEmail.length > 0 || checkDataBasePhone.length > 0){
            res.json({status:"userAllreadyRegistered"})
        }else{
            const newUser = await Users.create({
                FullName : req.body.FullName,
                Email:req.body.FullName,
                Password:hashPassword,
                Phone:req.body.Phone,
                Rule:req.body.Rule,
                Province:req.body.province,

            })
            res.json({status:'registered'})
        }
    }catch(error){

    }
}
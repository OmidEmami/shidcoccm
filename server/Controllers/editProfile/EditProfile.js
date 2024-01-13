import Users from "../../Models/Users.js";
import bcrypt from "bcrypt"
 
export const editProfile = async (req,res) =>{
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.Password, salt);
    try{
        const response = await Users.update({
            FullName : req.body.FullName,
            Password :hashPassword,
            Email : req.body.Email,
            Phone: req.body.PhoneNumber
        },{
            where:{
                Email : req.body.Email,
                Phone: req.body.PhoneNumber
            }
        })
        res.json({msg:"editSuccessful"})
    }catch(error){
        console.log(error)
        res.status(400).json({msg:"failed"})
    }
    
}
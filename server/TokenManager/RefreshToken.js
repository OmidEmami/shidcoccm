import Users from "../Models/Users.js";
import jwt from "jsonwebtoken";
 
export const refreshToken = async(req, res) => {
    try {
        
        const refreshToken = req.cookies.refreshToken;
        console.log(refreshToken)
        if(!refreshToken) return res.sendStatus(401);
        
        const user = await Users.findAll({
            where:{
                RefreshToken: refreshToken
            }
        });
        
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const name = user[0].FullName;
            const email = user[0].Email;
            const phoneNumber = user[0].Phone;
            const type = user[0].Type;
            const rule = user[0].Rule;
            const province = user[0].Province;
            
            const accessToken = jwt.sign({userId, name, email,phoneNumber, type,rule,province}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '1d'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        res.sendStatus(403);
    }
}
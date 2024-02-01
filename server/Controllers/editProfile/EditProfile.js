import Users from "../../Models/Users.js";
import bcrypt from "bcrypt"
import Image from "../../Models/Avatar.js";
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
export const uploadAvatar = async (req, res) => {
    console.log(req.file);

    try {
        const userEmail = req.body.user;
        
        // Find the existing image for the user
        const existingImage = await Image.findOne({ user: userEmail });

        // If there's an existing image, delete it
        if (existingImage) {
            await existingImage.deleteOne();
        }

        // Create a new image with the uploaded file
        const newImage = new Image({
            avatar: req.file.buffer,
            user: userEmail,
        });

        // Save the new image
        await newImage.save();

        res.status(201).send('Image uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
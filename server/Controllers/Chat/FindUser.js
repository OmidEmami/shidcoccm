import Users from "../../Models/Users.js";
import { Sequelize, col } from "sequelize";
import Image from "../../Models/Avatar.js";
export const findUser = async(req,res)=>{
    const query = req.query.query.toLowerCase();

  try {
   
    const results = await Users.findAll({
      where: {
        FullName: {
          [Sequelize.Op.like]: `${query}%`,
        },
      },
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
export const getAllAvatar = async(req,res)=>{

        try {
          
          const image = await Image.find({});
      
          if (!image) {
            return res.status(404).send('Image not found');
          }
      
          res.set('Content-Type', 'image/jpeg');
          res.send(image);
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      
}
export const getAvatarUser = async(req,res)=>{
    try {
        const user = req.params.user;
        const image = await Image.findOne({ user: user });
    
        if (!image) {
          return res.status(404).send('Image not found');
        }
    
        res.set('Content-Type', 'image/jpeg');
        res.send(image.avatar);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
}
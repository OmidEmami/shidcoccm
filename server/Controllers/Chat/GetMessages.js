import mongoose from 'mongoose';
export const getMessages = async(req,res)=>{
    try {
        const ChatUserSchema = new mongoose.Schema({
          sender: String,
          receiver:String,
          sendername: String,
          receivername : String,
          date:Date,
          message: String,
        })
        const collName = req.body.user + 's'
        
        const OmidUser =mongoose.models[collName] || mongoose.model(collName, ChatUserSchema);
        
        const messages = await OmidUser.find({});
        
        res.status(200).json({messages});
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
}

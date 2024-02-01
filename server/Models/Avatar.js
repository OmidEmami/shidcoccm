import mongoose from 'mongoose';
const imageSchema = new mongoose.Schema({
    user: String,
    avatar: {
      type: Buffer,
    },
  });
  
  const Image = mongoose.models['Image'] || mongoose.model('Image', imageSchema);
  export default Image
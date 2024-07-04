import mongoose from 'mongoose';
const fileSchema = new mongoose.Schema({
    user: String,
    file: {
      type: Buffer,
    },
  });
  
  const Files = mongoose.models['Files'] || mongoose.model('Files', fileSchema);
  export default Files
import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
    productName: { type: String},
    productCategory: String,
    image: Buffer,
  });
const Products = mongoose.model('Product', productSchema);
export default Products;
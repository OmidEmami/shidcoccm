import mongoose from 'mongoose';
const productVariantSchema = new mongoose.Schema({
    productName:String,
    productCategory: String,
    VariantName:String,
    VariantColor:String,
    VariantDescription:String,
    images: [Buffer],
  });
const ProductsVariant = mongoose.model('ProductsVariant', productVariantSchema);
export default ProductsVariant
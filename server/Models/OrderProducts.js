import mongoose from 'mongoose';
const productVariantOrderCart = new mongoose.Schema({
    productName:String,
    productCategory: String,
    VariantName:String,
    VariantColor:String,
    VariantId:String,
    QuantityInCart:String,
    OrderUniqueCode:String,
    UserName:String,
    PhoneNumber:String,
    Time:String,
    Status:String
    
  });
const OrderProducts = mongoose.model('OrderProducts', productVariantOrderCart);
export default OrderProducts
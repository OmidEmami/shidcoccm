import OrderProducts from "../../Models/OrderProducts.js"
export const getFollowUpOrder = async(req,res)=>{
    try{
               
        const orders = await OrderProducts.find({UserName : req.body.user});
            
         
             res.json(orders);
    }catch(error){

    }
}

// productName:String,
//     productCategory: String,
//     VariantName:String,
//     VariantColor:String,
//     VariantId:String,
//     QuantityInCart:String,
//     OrderUniqueCode:String,
//     UserName:String,
//     PhoneNumber:String,
//     Time:String,
//     Status:String
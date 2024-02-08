import ProductsVariant from "../../Models/ProductsVariant.js";
export const getProductsVariants = async(req,res)=>{
    try{
       
        const products = await ProductsVariant.find({productName : req.body.ProductName ,
             productCategory : req.body.ProductCategory});
             const productsWithImages = products.map(product => {
                const images = product.images.map(imageBuffer => {
                  return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
                });
          
                return { ...product.toObject(), images: images };
              });
          
              res.json(productsWithImages);
    }catch(error){

    }
}



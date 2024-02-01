import Products from "../../Models/Products.js";
export const getAllProducts = async(req,res)=>{
    try {
              const products = await Products.find({}); // Fetch all products from the database
        
              // Convert each product's image from Buffer to a string that can be used as a src for an <img> tag
              const productsWithImages = products.map(product => {
                  const image = product.image ? `data:image/jpeg;base64,${product.image.toString('base64')}` : null;
                  return { ...product.toObject(), image: image };
              });
        
              res.json(productsWithImages);
          } catch (error) {
              console.error(error);
              res.status(500).send('Internal Server Error');
          }
}
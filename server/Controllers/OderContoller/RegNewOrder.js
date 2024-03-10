import OrderProducts from "../../Models/OrderProducts.js";
export const regNewOrder = async(req,res)=>{
    
        const orderCode = generateRandomString();
        try{
            const newProductOrder = new OrderProducts({ productName, productCategory,productDesc, image });
            await newProduct.save();
        }catch(error){

        }



    function generateRandomString() {
        const allChars = "0123456789abcdefghijklmnopqrstuvwxyz";
        let result = "";
      
        // Generate 5 random numbers
        for (let i = 0; i < 5; i++) {
          result += allChars[Math.floor(Math.random() * 10)]; // Access characters 0-9
        }
      
        // Generate 2 random lowercase English letters
        for (let i = 0; i < 2; i++) {
          const randomIndex = Math.floor(Math.random() * 26) + 10; // Access characters a-z (index 10-35)
          result += allChars[randomIndex];
        }
      
        // Shuffle the characters for a more random order (optional)
        result = result.split("").sort(() => Math.random() - 0.5).join("");
      
        return result;
      }
}
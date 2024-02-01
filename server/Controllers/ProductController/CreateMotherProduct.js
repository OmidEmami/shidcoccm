import Products from "../../Models/Products.js";
import multer from "multer";

export const createProduct = async (req,res) => {
    
    const storage = multer.memoryStorage();
  
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg') {
            cb(null, true); // Accept file
        } else {
            cb(null, false); // Reject file
            cb(new Error('Only JPEG files are allowed')); // Optionally pass an error message
        }
    };
  
    const upload = multer({ 
        storage: storage, 
        limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
        fileFilter: fileFilter 
    }).single('image');
  
    // Execute multer within the route to handle file upload
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            return res.status(500).json({ message: err.message });
        } else if (err) {
            // An unknown error occurred when uploading
            return res.status(500).json({ message: "An error occurred during the file upload." });
        }
  
        // Check if file was received
        if (!req.file) {
            return res.status(400).json({ message: "Invalid file type or file too large." });
        }
  
        // Proceed with your existing logic here, req.file is the uploaded file
        try {
            const { productName, productCategory } = req.body;
            const existingProduct = await Products.findOne({ productName: productName });
  
            if (existingProduct) {
                return res.status(400).json({ message: "A product with this name already exists." });
            }
  
            const image = req.file.buffer;
            const newProduct = new Products({ productName, productCategory, image });
            await newProduct.save();
  
            res.status(201).json({ message: "Product uploaded successfully!", newProduct });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error uploading product');
        }
    });
  };

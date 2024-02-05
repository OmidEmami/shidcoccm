import ProductsVariant from "../../Models/ProductsVariant.js";
import multer from "multer";

export const createVariant = async (req, res) => {
    const storage = multer.memoryStorage();

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg') {
            cb(null, true); // Accept file
        } else {
            cb(new Error('Only JPEG files are allowed'), false); // Reject file
        }
    };

    const upload = multer({
        storage: storage,
        limits: { fileSize: 20 * 1024 * 1024 }, // 2MB file size limit per file
        fileFilter: fileFilter
    }).array('images'); 

    // Execute multer within the route to handle file upload
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            return res.status(500).json({ message: err.message });
        } else if (err) {
            // An unknown error occurred when uploading
            return res.status(500).json({ message: "An error occurred during the file upload." });
        }

        // Check if files were received
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded." });
        }

        // Proceed with your existing logic here, req.files contains the uploaded files
        try {
            const { variantName,
                variantColor,
                variantDescriptio,
                productName,
                productCategory } = req.body;
            const existingProduct = await ProductsVariant.findOne({ productName: productName, variantName : variantName });

            if (existingProduct) {
                return res.status(400).json({ message: "A product with this name already exists." });
            }

            // Assuming your Products model can handle an array of images
            const images = req.files.map(file => file.buffer);
            const newProduct = new ProductsVariant({ variantName,
                variantColor,
                variantDescriptio,
                productName,
                productCategory,images});
            await newProduct.save();

            res.status(201).json({ message: "Product uploaded successfully!", newProduct });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error uploading product');
        }
    });
};
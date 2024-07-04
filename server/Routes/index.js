import express from "express";
import { checkVerificationCode, loginWithCode, sendLoginVerifyCode, verifyPhoneNumber } from "../Controllers/verifyWithCode/VerificationCode.js";
import { loginNormal } from "../Controllers/Login/Login.js";
import { refreshToken } from "../TokenManager/RefreshToken.js";
import { editProfile, uploadAvatar } from "../Controllers/editProfile/EditProfile.js";
import { createProduct } from "../Controllers/ProductController/CreateMotherProduct.js";
import { getAllProducts } from "../Controllers/ProductController/GetAllProducts.js";
import { findUser, getAllAvatar, getAvatarUser } from "../Controllers/Chat/FindUser.js";
import multer from 'multer';
import { getMessages } from "../Controllers/Chat/GetMessages.js";
import { createVariant } from "../Controllers/ProductController/AddProductVariant.js";
import { getProductsVariants } from "../Controllers/ProductController/GetProductsVariants.js";
import { regNewOrder } from "../Controllers/OderContoller/RegNewOrder.js";
import { getFollowUpOrder } from "../Controllers/OderContoller/GetFollowUpOrder.js";
import { SendExhibition } from "../Controllers/SendExhibition.js";
import { fileUploader } from "../Controllers/FileManager/FileUpload.js";
import { getFilesUser } from "../Controllers/FileManager/GetFilesUser.js";
const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router();
router.post('/api/getverificationcode', verifyPhoneNumber)
router.post('/api/checkverificationcode', checkVerificationCode)
router.post('/api/loginwithcode',loginWithCode)
router.post('/api/sendloginverifycode',sendLoginVerifyCode)
router.post('/api/loginnormal', loginNormal);
router.get('/api/token', refreshToken)
router.post('/api/editprofile',editProfile);
router.post('/api/uploadProduct', createProduct)
router.get('/api/products', getAllProducts)
router.get('/api/search',findUser)
router.post('/api/uploadavatar', upload.single('image'), uploadAvatar);
router.post('/api/uploadfilecustomer', upload.single('file') , fileUploader)
router.get('/api/getavatarall',getAllAvatar)
router.get('/api/getavatar/:user', getAvatarUser);
router.post('/api/messages',getMessages)
router.post('/api/addVariantProduct',createVariant)
router.post('/api/getProductVariants', getProductsVariants)
router.post('/api/regNewOrder',regNewOrder);
router.post('/api/getOrdersCustomer',getFollowUpOrder)
router.post('/api/sendExhibition', SendExhibition)
router.post('/api/getfilesuser', getFilesUser)
export default router;
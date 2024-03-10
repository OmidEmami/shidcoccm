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
const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router();
router.post('/getverificationcode', verifyPhoneNumber)
router.post('/checkverificationcode', checkVerificationCode)
router.post('/loginwithcode',loginWithCode)
router.post('/sendloginverifycode',sendLoginVerifyCode)
router.post('/loginnormal', loginNormal);
router.get('/token', refreshToken)
router.post('/editprofile',editProfile);
router.post('/uploadProduct', createProduct)
router.get('/products', getAllProducts)
router.get('/api/search',findUser)
router.post('/uploadavatar', upload.single('image'), uploadAvatar);
router.get('/getavatarall',getAllAvatar)
router.get('/getavatar/:user', getAvatarUser);
router.post('/messages',getMessages)
router.post('/addVariantProduct',createVariant)
router.post('/getProductVariants', getProductsVariants)
router.post('/regNewOrder',regNewOrder)
export default router;
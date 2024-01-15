import express from "express";

import { checkVerificationCode, loginWithCode, sendLoginVerifyCode, verifyPhoneNumber } from "../Controllers/verifyWithCode/VerificationCode.js";
import { loginNormal } from "../Controllers/Login/Login.js";
import { refreshToken } from "../TokenManager/RefreshToken.js";
import { editProfile } from "../Controllers/editProfile/EditProfile.js";
// import { newChat } from "../Controllers/Chat/NewChat.js";
const router = express.Router();
router.post('/getverificationcode', verifyPhoneNumber)
router.post('/checkverificationcode', checkVerificationCode)
router.post('/loginwithcode',loginWithCode)
router.post('/sendloginverifycode',sendLoginVerifyCode)
router.post('/loginnormal', loginNormal);
router.get('/token', refreshToken)
router.post('/editprofile',editProfile);
// router.post('/newChat', newChat)
export default router;
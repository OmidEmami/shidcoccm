import express from "express";
import { registerNewUser } from "../Controllers/SignUp/SignUpUser.js";
import { checkVerificationCode, loginWithCode, sendLoginVerifyCode, verifyPhoneNumber } from "../Controllers/verifyWithCode/VerificationCode.js";
import { loginNormal } from "../Controllers/Login/Login.js";
const router = express.Router();
router.post('/getverificationcode', verifyPhoneNumber)
router.post('/checkverificationcode', checkVerificationCode)
router.post('/loginwithcode',loginWithCode)
router.post('/sendloginverifycode',sendLoginVerifyCode)
router.post('/loginnormal', loginNormal)
export default router;
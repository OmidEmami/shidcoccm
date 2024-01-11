import express from "express";
import { registerNewUser } from "../Controllers/SignUp/SignUpUser.js";
import { checkVerificationCode, loginWithCode, sendLoginVerifyCode, verifyPhoneNumber } from "../Controllers/verifyWithCode/VerificationCode.js";
const router = express.Router();
router.post('/getverificationcode', verifyPhoneNumber)
router.post('/checkverificationcode', checkVerificationCode)
router.post('/loginwithcode',loginWithCode)
router.post('/sendloginverifycode',sendLoginVerifyCode)
export default router;
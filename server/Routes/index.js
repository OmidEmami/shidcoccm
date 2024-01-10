import express from "express";
import { registerNewUser } from "../Controllers/SignUp/SignUpUser.js";
import { checkVerificationCode, loginWithCode, verifyPhoneNumber } from "../Controllers/verifyWithCode/VerificationCode.js";
const router = express.Router();
router.post('/getverificationcode', verifyPhoneNumber)
router.post('/checkverificationcode', checkVerificationCode)
router.post('/loginwithcode',loginWithCode)
export default router;
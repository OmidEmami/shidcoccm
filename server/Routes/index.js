import express from "express";
import { registerNewUser } from "../Controllers/SignUp/SignUpUser.js";
import { checkVerificationCode, verifyPhoneNumber } from "../Controllers/verifyWithCode/VerificationCode.js";
const router = express.Router();
router.post('/getverificationcode', verifyPhoneNumber)
router.post('/checkverificationcode', checkVerificationCode)
export default router;
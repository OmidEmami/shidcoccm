import React,{useState} from 'react'
import TextField from '@mui/material/TextField';
import styles from "./Login.module.css";
import Button from '@mui/material/Button';
import Logo from "../../assests/Logo/mainLogo.png";
import { notify } from "../toast/toast.js";
import Modal from 'react-modal';
import MyTimer from "../timer/MyTimer"
import axios from 'axios';
function Login() {
    const [loginCodeModal, setLoginCodeModal] = useState(false);
    const [phone, setPhone] = useState('');
    const [smsCode, setSmsCode] = useState('');
    const [showPhoneTextField, setShowPhoneTextField] = useState(true);
    const [showSmsCodeField, setShowSmsCodeField] = useState(false)
    const [userName, setUserName] = useState('');
    const [password,setPassword] = useState('');
    const [userNameError, setUserNameError] = useState({status : '', msg:''});
    const [passwordError, setPasswordError] = useState({status : '', msg:''});
    const [smsCodeError, setSmsCodeError] = useState({status:'', msg:''})
    const [phoneError, setPhoneError] = useState({status:'',msg:''});
    const [receivedCode, setReceivedCode] = useState('');
    const [enableFinalCodeButton, setEnableFinalCodeButton] = useState(true);
    const [showTryReceiveCodeButton, setShowTryReceiveCodeButton] = useState(false)
    const time = new Date();
    time.setSeconds(time.getSeconds() + 180);
    const customStyles = {
      
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        
        
      },
      overlay: {zIndex: 1000}
    };
    const sendPhoneNumberToCode = async ()=>{
      try{
        const response = await axios.post('http://localhost:3001/sendloginverifycode',{
          PhoneNumber: phone
        })
        
        if(response.data.msg === 'phoneNotFound'){
          setPhoneError({status:true, msg :'کابری با این شماره یافت نشد'})
          notify("کاربری با این شماره یافت نشد",'error')
        }else if(response.data.msg === "codeSent"){
          setPhoneError({status:false, msg :''})
          
          setShowPhoneTextField(false);
   
    
          setShowSmsCodeField(true)
          notify('کد ورود پیامک شد','success')
          function expireVerifyCode (){
            setShowPhoneTextField(true);
   
    
          setShowSmsCodeField(false)
          }
          setTimeout(expireVerifyCode, 180000);
        }
      }catch(error){
        notify("ارتباط با سرور برقرار نیست!",'error')
      }
    

      
    };
    const setReceivedCodeAndButtonStatus = async(e)=>{
      setReceivedCode(e)
      const fiveDigitsRegex = /^\d{5}$/;
      const isFiveDigits = fiveDigitsRegex.test(e);
      setSmsCodeError({status:false, msg :''})
      if (isFiveDigits){
        setEnableFinalCodeButton(false)
      }
    }
    
    const loginFunction = async (e)=>{
        e.preventDefault();
        setPasswordError({status:false, msg:''})
        setUserNameError({status:false, msg:''})
        if(userName === '' || userName === null){
            setUserNameError({status:true, msg:"این قسمت الزامی است"})
        }else if(password === '' || password === null){
            setPasswordError({status:true, msg:"این فیلد الزامی است"})
        }
        
    }
    const loginWithCode = async()=>{
      try{

      
      const response = await axios.post("http://localhost:3001/loginwithcode",{
        PhoneNumber : phone,
        VerifyCode : receivedCode
      })
      
    
      if(response.data.msg === "verified"){
        setLoginCodeModal(false)
        notify("ورود موفق", 'success')
      }else if(response.data.msg === "notverified"){
        notify("کد وارد شده صحیح نیست",'error')
        setSmsCodeError({status : true, msg:'کد وارد شده صحیح نیست'})
      }
      }catch{
        notify("خطا", 'error')
      }
    }
  return (
    <div className={styles.loginMainContainer}>
       <Modal
       
        isOpen={loginCodeModal}
        onRequestClose={()=>setLoginCodeModal(false)}
        style={customStyles}
        contentLabel="Code Verification Sms"
      >
        <div className={styles.modalContainer}>
          {showPhoneTextField &&(
            <div className={styles.textField}>
            <label>شماره موبایل</label>
            <TextField placeholder='09123456789 : مثلا  '  value={phone} onChange={(e)=>setPhone(e.target.value)} fullWidth 
            error={phoneError.status} type='text'  id="phone" label="شماره موبایل" variant="outlined" />
            {phoneError.status && <span style={{color:'red'}}>{phoneError.msg}</span>}
            <Button onClick={sendPhoneNumberToCode} fullWidth variant="outlined">دریافت کد یکبارمصرف</Button>
            </div>
          )}
          {showSmsCodeField &&(
            <div className={styles.textField}>
            <label>کد دریافت شده از طریق SMS</label>
            <TextField value={receivedCode} onChange={(e)=>setReceivedCodeAndButtonStatus(e.target.value)} fullWidth
            error={smsCodeError.status} type='number' id='smsCode' label="کد دریافت شده" variant='outlined'
            />
          {smsCodeError && <span style={{color:'red'}}>{smsCodeError.msg}</span>}
            <Button disabled={enableFinalCodeButton} onClick={loginWithCode} fullWidth variant="outlined">ورود - <MyTimer expiryTimestamp={time} /></Button>
            </div>
          )}
          
        
        
        </div>
      </Modal>
        <div className={styles.loginHeader}>
            <h3>ورود به سیستم</h3>
            <img width="200vw" src={Logo} alt='کارخانه تجهیزات آموزشی شیدکو' />
        </div>
      <form className={styles.formContainer} onSubmit={loginFunction}>
        <label>نام کاربری</label>
      <TextField value={userName} onChange={(e)=>setUserName(e.target.value)} fullWidth error={userNameError.status} type='text'  id="userName" label="نام کاربری" variant="outlined" />
      {userNameError.status && <span style={{color:"red"}}>{userNameError.msg}</span>}
      <label>رمز عبور</label>
      <TextField value={password} onChange={(e)=>setPassword(e.target.value)} fullWidth type='password' error={passwordError.status}  id="password" label="رمز عبور" variant='outlined' />
      {passwordError.status && <span style={{color:"red"}}>{passwordError.msg}</span>}
      <div className={styles.formButtonContainer}>
      <Button type='submit' variant="outlined">ورود</Button>
      <Button variant="outlined">حساب ندارم، ثبت نام میکنم</Button>
      </div>
      <Button onClick={()=>setLoginCodeModal(true)} fullWidth variant="outlined">ورود با کد یکبار مصرف</Button>
      </form>
    </div>
  )
}

export default Login

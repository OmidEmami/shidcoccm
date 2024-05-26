import React,{useState} from 'react'
import TextField from '@mui/material/TextField';
import styles from "./Login.module.css";
import Button from '@mui/material/Button';
import Logo from "../../assests/Logo/mainLogo.png";
import { notify } from "../toast/toast.js";
import Modal from 'react-modal';
import MyTimer from "../timer/MyTimer"
import axios from 'axios';
import { useHistory } from 'react-router-dom';
function Login() {
    const history = useHistory();
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
        
        if(response.data.msg === "codeSent"){
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
        if(error.response.data.msg === 'phoneNotFound'){
          setPhoneError({status:true, msg :'کابری با این شماره یافت نشد'})
          notify("کاربری با این شماره یافت نشد",'error')
        }else if(error.response.data.msg === 'noConnection'){
        notify("ارتباط با سرور برقرار نیست!",'error')
      }
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
        }else{
          try{
            const response = await axios.post("http://localhost:3001/loginnormal",{
              UserName : userName,
              Password:password
            })
            setPasswordError({status:false, msg:''})
            setUserNameError({status:false, msg:''})
            console.log(response)
            if(response.data ? (response.data.msg === "ok"):false){
              notify('ورود موفق','success')
              console.log(response)
              if(response.data.user[0].Type === "Staff"){
              history.push('/sdash')
              }else if(response.data.user[0].Type === "Customer"){
                history.push('/cdash')
              }
            }
          }catch(error){
            if(error.response.data.msg === 'Wrong Password'){
              notify('رمز عبور اشتباه است','error')
              setPasswordError({status:true, msg:'رمز عبور اشتباه است!'})
            }else if(error.response.data.msg === 'user not found'){
              notify('کاربری با این مشخصات یافت نشد!','error')
              setUserNameError({status:true,msg:'کاربری با این مشخصات یافت نشد!'})
            }else{
              notify('ارتباط با سرور برقرار نیست!','error')
            }
            
          }
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
        history.push('/sdash')
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
       
        <div className={styles.div1}></div>
        <div className={styles.div2}></div>
      <form className={styles.formContainer} onSubmit={loginFunction}>
      
        <img alt="logo" src={Logo} width="200vw" />
      <TextField
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#0005a4', // Default border color
             // Set background color to white
          },
          '&:hover fieldset': {
            borderColor: '#2ecc71', // Border color when hovered
          },
          '&.Mui-focused fieldset': {
            borderColor: '#3498db', // Border color when focused
          },
        },
        '& .MuiInputBase-input': {
          color: 'black', // Set text color to black
        },
        '& .MuiInputBase-input::placeholder': {
          color: 'black', // Set placeholder color to black
          opacity: 1, // Ensure the placeholder color is not translucent
        },
      }}
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
      fullWidth
      error={userNameError.status}
      type="text"
      id="userName"
      placeholder="نام کاربری"
      variant="outlined"
    />
      {userNameError.status && <span style={{color:"red"}}>{userNameError.msg}</span>}
      
      <TextField
       sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#0005a4', // Default border color
             // Set background color to white
          },
          '&:hover fieldset': {
            borderColor: '#2ecc71', // Border color when hovered
          },
          '&.Mui-focused fieldset': {
            borderColor: '#3498db', // Border color when focused
          },
        },
        '& .MuiInputBase-input': {
          color: 'black', // Set text color to black
        },
        '& .MuiInputBase-input::placeholder': {
          color: 'black', // Set placeholder color to black
          opacity: 1, // Ensure the placeholder color is not translucent
        },
      }}
      value={password} onChange={(e)=>setPassword(e.target.value)} fullWidth type='password' error={passwordError.status}  id="password" placeholder="رمز عبور" variant='outlined' />
      {passwordError.status && <span style={{color:"red"}}>{passwordError.msg}</span>}
      <Button style={{backgroundColor:"#0005a4", color:"white"}} fullWidth type='submit' variant="outlined">ورود</Button>
      
      <div className={styles.formButtonContainer}>
      <Button onClick={()=>setLoginCodeModal(true)}  variant="outlined">ورود با کد یکبار مصرف</Button>
      <Button onClick={()=>history.push('/usersignup')} variant="outlined">ایجاد حساب کاربری</Button>
      </div>
      </form>
    </div>
  )
}

export default Login

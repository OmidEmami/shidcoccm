import React,{useState} from 'react'
import styles from "./SignUpUser.module.css";
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Logo from "../../assests/Logo/mainLogo.png";
import { notify } from "../toast/toast.js";
import Modal from 'react-modal';
import MyTimer from "../timer/MyTimer";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

function SignUpUser() {
  
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
    const CustomerTypes = [
  {value:'StationaryWholeSaler', item:'بنکدار لوازم التحریر'},
  {value:'ManufacturerAndSeller', item:'تولید کننده و فروشنده'},
  {value:'StationaryStore', item:'فروشگاه لوازم التحریر'},
  {value:'StationeryAndOfficeFurnitureStore', item:'فروشگاه لوازم التحریر و مبلمان اداری'},
  {value:'OfficeFurnitureStore', item:'فروشگاه مبلمان اداری'},
  {value:'CommercialCompany', item: 'شرکت بازرگانی'},
  {value:'EducationalCentersAndUniversities', item:'مراکز آموزشی و دانشگاه ها'},
  {value:'Consumer', item:'مصرف کننده'},
  {value:'Supplier', item:'تامین کننده'},
  {value:'OnlineShop',item:'فروشگاه آنلاین'}
]
const iranProvinces = [
  { name: 'East Azerbaijan', value: 'آذربایجان شرقی' },
  { name: 'West Azerbaijan', value: 'آذربایجان غربی' },
  { name: 'Ardabil', value: 'اردبیل' },
  { name: 'Isfahan', value: 'اصفهان' },
  { name: 'Ilam', value: 'ایلام' },
  { name: 'Bushehr', value: 'بوشهر' },
  { name: 'Tehran', value: 'تهران' },
  { name: 'Chaharmahal and Bakhtiari', value: 'چهارمحال و بختیاری' },
  { name: 'South Khorasan', value: 'خراسان جنوبی' },
  { name: 'Razavi Khorasan', value: 'خراسان رضوی' },
  { name: 'North Khorasan', value: 'خراسان شمالی' },
  { name: 'Khuzestan', value: 'خوزستان' },
  { name: 'Zanjan', value: 'زنجان' },
  { name: 'Semnan', value: 'سمنان' },
  { name: 'Sistan and Baluchestan', value: 'سیستان و بلوچستان' },
  { name: 'Fars', value: 'فارس' },
  { name: 'Qazvin', value: 'قزوین' },
  { name: 'Qom', value: 'قم' },
  { name: 'Kurdistan', value: 'کردستان' },
  { name: 'Kerman', value: 'کرمان' },
  { name: 'Kermanshah', value: 'کرمانشاه' },
  { name: 'Kohgiluyeh and Boyer-Ahmad', value: 'کهگیلویه و بویراحمد' },
  { name: 'Golestan', value: 'گلستان' },
  { name: 'Gilan', value: 'گیلان' },
  { name: 'Lorestan', value: 'لرستان' },
  { name: 'Mazandaran', value: 'مازندران' },
  { name: 'Markazi', value: 'مرکزی' },
  { name: 'Hormozgan', value: 'هرمزگان' },
  { name: 'Hamadan', value: 'همدان' },
  { name: 'Yazd', value: 'یزد' }
];
    const [showModalCodeVerify, setShowModalCodeVerify] = useState(false)
    const [Name, setName] = useState('');
    const [NameError, setNameError] = useState({status:'', msg:''});
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [PhoneNumberError, setPhoneNumberError] = useState({status:'', msg:''});
    const [Email, setEmail] = useState('');
    const [EmailError, setEmailError] = useState({status:'', msg:''});
    const [Rule, setRule] = useState('');
    const [RuleError, setRuleError] = useState({status:'', msg:''});
    const [Province, setProvince] = useState('')
    const [ProvinceError, setProvinceError] = useState({status:'', msg:''})
    const [Password, setPassword] = useState('')
    const [PasswordError, setPasswordError] = useState({status:'', msg:''})
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState({status:'', msg:''});
    const [receivedCode, setReceivedCode] = useState('')
    const [receivedCodeError, setReceivedCodeError] = useState({status:'', msg:''});
    
    const [enableVerifyCodeButton, setEnableVerifyCodeButton] = useState(true)
    const time = new Date();
    time.setSeconds(time.getSeconds() + 180);
  const receiveVerificationCode = async () =>{


}
const sendSmsCodeVerification = async () =>{
  setShowModalCodeVerify(true)
}
const changeReceivedCode = async (e)=>{
  setReceivedCode(e)
  const fiveDigitsRegex = /^\d{5}$/;
  const isFiveDigits = fiveDigitsRegex.test(e);
  if (isFiveDigits){
    setEnableVerifyCodeButton(false)
  }
}
const checkBlurFullName = ()=>{
  setNameError({status:false, msg:''})
  if(Name=== "" || Name === null){
    setNameError({status:true, msg:'لطفا این فیلد را کامل کنید'})
  }
}
const checkBlurPhoneNumber = ()=>{
  setPhoneNumberError({status:false, msg:''})
  if(PhoneNumber=== "" || PhoneNumber === null){
    setPhoneNumberError({status:true, msg:'لطفا این فیلد را کامل کنید'})
  }
}
const checkBlurEmail = ()=>{
  setEmailError({status:false, msg:''})
  if(Email=== "" || Email === null){
    setEmailError({status:true, msg:'لطفا این فیلد را کامل کنید'})
  }
}
const checkBlurRule = ()=>{
  setRuleError({status:false, msg:''})
  if(Rule === "" || Rule === null){
    setRuleError({status:true, msg:'لطفا این فیلد را کامل کنید'})
  }
}
const checkBlurProvince = ()=>{
  setProvinceError({status:false, msg:''})
  if(Province=== "" || Province === null){
    setProvinceError({status:true, msg:'لطفا این فیلد را کامل کنید'})
  }
}
const checkBlurPassword = ()=>{
  const passwordRegex = /^(?=.*[a-zA-Z]).{5,}$/;
  const isValid = passwordRegex.test(Password);
  setPasswordError({status:false, msg:''})
  if(isValid){

  
  if(Password=== "" || Password === null){
    setPasswordError({status:true, msg:'لطفا این فیلد را کامل کنید'})
  }else{
    setPasswordError({status:false, msg:''})
  }
  }else{
    setPasswordError({status:true, msg:'رمز عبور باید شامل حداقل 5 عدد و یک حرف انگلیسی باشد'})
}
}
  const checkBlurConfirmPassword = ()=>{
    if(Password === confirmPassword){
  const passwordRegex = /^(?=.*[a-zA-Z]).{5,}$/;
  const isValid = passwordRegex.test(confirmPassword);
  setConfirmPasswordError({status:false, msg:''})
  if(isValid){

  
  if(confirmPassword=== "" || confirmPassword === null){
    setConfirmPasswordError({status:true, msg:'لطفا این فیلد را کامل کنید'})
  }else{
    setConfirmPasswordError({status:false, msg:''})
  }
  }else{
    setConfirmPasswordError({status:true, msg:'رمز عبور باید شامل حداقل 5 عدد و یک حرف انگلیسی باشد'})
}
    }else{
      setConfirmPasswordError({status:true, msg:'تکرار رمز عبور درست نیست!'})
    }
}
  return (
    <div dir='rtl' className={styles.MainSignUpContainer}>
        <Modal
       
       isOpen={showModalCodeVerify}
       onRequestClose={()=>showModalCodeVerify(false)}
       style={customStyles}
       contentLabel="Code Verification Sms"
     >
       <div className={styles.modalContainer}>
         <h3>جهت تایید شماره موبایل لطفا کد دریافت شده از طریق پیام کوتاه را وارد نمایید</h3>
         <TextField sx={{ fontSize: 'large' , fontFamily:"shabnamM",direction:"rtl"}} type='number' fullWidth  placeholder='کد تایید' id='VerifyCode'
         variant='outlined' value={receivedCode} onChange={(e)=>changeReceivedCode(e.target.value)}/>
         <Button style={{direction:"rtl"}} disabled={enableVerifyCodeButton} fullWidth variant="outlined">تایید شماره تماس : <MyTimer expiryTimestamp={time} /></Button>
       </div>
     </Modal>
      <div className={styles.loginHeader}>
            <h3>ثبت نام مشتریان</h3>
            <img width="200vw" src={Logo} alt='کارخانه تجهیزات آموزشی شیدکو' />
        </div>
      <form className={styles.formContainer} onSubmit={receiveVerificationCode}>
        <label>نام کامل</label>
        <TextField error={NameError.status} onBlur={checkBlurFullName} fullWidth placeholder='نام و نام خانوادگی' id="FullName"
            variant="outlined" type='text' value={Name} onChange={(e)=>setName(e.target.value)} />
            {NameError.status === true && <span style={{color:"red"}}>{NameError.msg}</span>}
        <label>شماره تماس</label>
        <TextField onBlur={checkBlurPhoneNumber} error={PhoneNumberError.status} fullWidth  placeholder='مثلا : 09123456789'  id="PhoneNumber"
          variant="outlined" type='number' value={PhoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} />
          {PhoneNumberError.status === true && <span style={{color:"red"}}>{PhoneNumberError.msg}</span>}
        <label>ایمیل</label>
        <TextField error={EmailError.status} onBlur={checkBlurEmail} fullWidth  placeholder='مثلا : mail@gmail.com' id="Email"
          variant="outlined" type='text' value={Email} onChange={(e)=>setEmail(e.target.value)} />
          {EmailError.status === true && <span style={{color:"red"}}>{EmailError.msg}</span>}
        <label>نوع کسب وکار : </label>
        <InputLabel id="RuleSelect">نوع کسب و کار خود را انتخاب کنید:</InputLabel>
        <Select error={RuleError.status} onBlur={checkBlurRule} sx={{ fontSize: 'large' , fontFamily:"shabnamM",direction:"rtl"}} fullWidth labelId='RuleSelect' id="RuleSelect" label="انتخاب نوع کسب و کار" value={Rule} onChange={(e)=>setRule(e.target.value)}>
        
          {CustomerTypes.map((value,item)=>(
            <MenuItem sx={{ fontSize: 'large' , fontFamily:"shabnamM",direction:"rtl"}} key={item} value={value.value}>{value.item}</MenuItem>
          ))}
        </Select>
        {RuleError.status === true && <span style={{color:"red"}}>{RuleError.msg}</span>}
        <label>استان: </label>
        <InputLabel id="Province">استان محل کار خود را انتخاب کنید:</InputLabel>
        <Select error={ProvinceError.status} onBlur={checkBlurProvince} sx={{ fontSize: 'large' , fontFamily:"shabnamM",direction:"rtl"}} fullWidth labelId='Province' id='Province' label='استان محل کار را انتخاب کنید' value={Province} onChange={(e)=>setProvince(e.target.value)}>
        
          {iranProvinces.map((value,item)=>(
            <MenuItem  sx={{ fontSize: 'large' , fontFamily:"shabnamM",direction:"rtl"}} key={item} value={value.name}>{value.value}</MenuItem>
          ))}
        </Select>
        {ProvinceError.status === true && <span style={{color:"red"}}>{ProvinceError.msg}</span>}
        <label>رمز عبور</label>
        <TextField error={PasswordError.status} type='password' onBlur={checkBlurPassword} fullWidth  placeholder='رمز عبور شامل اعداد و حداقل یک حرف انگلیسی' id="Password"
          variant="outlined"  value={Password} onChange={(e)=>setPassword(e.target.value)} />
          {PasswordError.status === true && <span style={{color:"red"}}>{PasswordError.msg}</span>}
          <label>تکرار رمز عبور</label>
          <TextField error={confirmPasswordError.status} type='password' onBlur={checkBlurConfirmPassword} fullWidth  placeholder='تکرار رمز عبور' id="ConfirmPassword"
          variant="outlined"  value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
          {confirmPasswordError.status === true && <span style={{color:"red"}}>{confirmPasswordError.msg}</span>}
        <Button onClick={sendSmsCodeVerification} fullWidth variant="outlined">ثبت نام</Button>
      </form>
      
    </div>
  )
}

export default SignUpUser
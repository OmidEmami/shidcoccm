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
const receiveVerificationCode = async () =>{


}
const sendSmsCodeVerification = async () =>{
  setShowModalCodeVerify(true)
}
const changeReceivedCode = async (e)=>{

}
  return (
    <div className={styles.MainSignUpContainer}>
        <Modal
       
       isOpen={showModalCodeVerify}
       onRequestClose={()=>showModalCodeVerify(false)}
       style={customStyles}
       contentLabel="Code Verification Sms"
     >
       <div className={styles.modalContainer}>
         <h3>جهت تایید شماره موبایل لطفا کد دریافت شده از طریق پیام کوتاه را وارد نمایید</h3>
         <TextField type='number' fullWidth label="کد تایید" placeholder='کد تایید' id='VerifyCode'
         variant='outlined' value={receivedCode} onChange={(e)=>changeReceivedCode(e.target.value)}
         />
       </div>
     </Modal>
      <div className={styles.loginHeader}>
            <h3>ثبت نام مشتریان</h3>
            <img width="200vw" src={Logo} alt='کارخانه تجهیزات آموزشی شیدکو' />
        </div>
      <form className={styles.formContainer} onSubmit={receiveVerificationCode}>
        <label>نام کامل</label>
        <TextField fullWidth label='نام کامل' placeholder='نام و نام خانوادگی' id="FullName"
            variant="outlined" type='text' value={Name} onChange={(e)=>setName(e.target.value)} />
        <label>شماره تماس</label>
        <TextField fullWidth label="شماره موبایل" placeholder='مثلا : 09123456789'  id="PhoneNumber"
          variant="outlined" type='number' value={PhoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} />
        <label>ایمیل</label>
        <TextField  fullWidth label='آدرس ایمیل' placeholder='مثلا : mail@gmail.com' id="Email"
          variant="outlined" type='text' value={Email} onChange={(e)=>setEmail(e.target.value)} />
        <label>نوع کسب وکار : </label>
        <InputLabel id="RuleSelect">نوع کسب و کار خود را انتخاب کنید:</InputLabel>
        <Select fullWidth labelId='RuleSelect' id="RuleSelect" label="انتخاب نوع کسب و کار" value={Rule} onChange={(e)=>setRule(e.target.value)}>
          {CustomerTypes.map((value,item)=>(
            <MenuItem key={item} value={value.value}>{value.item}</MenuItem>
          ))}
        </Select>
        <label>استان: </label>
        <InputLabel id="Province">استان محل کار خود را انتخاب کنید:</InputLabel>
        <Select fullWidth labelId='Province' id='Province' label='استان محل کار را انتخاب کنید' value={Province} onChange={(e)=>setProvince(e.target.value)}>
          {iranProvinces.map((value,item)=>(
            <MenuItem  key={item} value={value.name}>{value.value}</MenuItem>
          ))}
        </Select>
        <Button onClick={sendSmsCodeVerification} fullWidth variant="outlined">ثبت نام</Button>
      </form>
      
    </div>
  )
}

export default SignUpUser

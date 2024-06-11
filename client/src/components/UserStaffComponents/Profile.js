import React,{useState,useEffect} from 'react';
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import {notify} from "../toast/toast"
// import bcrypt from "bcrypt";
import LoadingComp from '../Loading/LoadingComp';
import styles from "./Profile.module.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BiBorderRadius } from 'react-icons/bi';

const theme = createTheme({
  typography: {
    fontFamily: 'iransans'
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily:"iransans",
          backgroundColor: 'white',
          borderColor:"blue",
          borderRadius:"10px",
          '& label.Mui-focused': {
            color: 'blue',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'blue',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
              border:"none"
              
            },
            '&:hover fieldset': {
              borderColor: 'black',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'blue',
            },
          },
        },
      },
    },
  },
});
function Profile() {
  
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [fullNameError, setFullNameError] = useState({status:false, msg:''});
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState({status:false , msg:''});
  const [email, setEmail] = useState('');
  const [rule, setRule] = useState('');
  const [type, setType] = useState('');
  const [province, setProvince] = useState('');
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState({status:false , msg:''});
  const [ruleError, setRuleError] = useState({status:false , msg:''});
  const [typeError, setTypeError] = useState({status:false , msg:''});
  const [provinceError, setProvinceError] = useState({status:false , msg:''});
  const [PasswordError ,setPasswordError] = useState({status:false , msg:''});
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState({status:false, msg:''});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('user',email)
      await axios.post('http://shidcoccm.ir/api/uploadavatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      alert('Error uploading image');
    }
  };

const realToken = useSelector((state) => state.tokenReducer.token);
  useEffect(() => {
    // refreshToken();
    const decoded = jwtDecode(realToken.realToken);
    setFullName(decoded.name)
    setPhone(decoded.phoneNumber);
    setEmail(decoded.email);
    setRule(decoded.rule);
    setType(decoded.type);
    setProvince(decoded.province);
    const user = decoded.email; // Replace with the actual user identifier
    
    // Fetch image data
    axios.get(`http://shidcoccm.ir/api/getavatar/${user}`, { responseType: 'arraybuffer' })
      .then(response => {
        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        console.log(response)
        setAvatar(imageUrl);
      })
      .catch(error => {
        console.error('Error fetching image:', error);
      });
}, []);
const fullNameBlur = () =>{
  setFullNameError({status:false, msg:''})
  if(fullName === ''){
    setFullNameError({status:true, msg:'نام کامل خود را وارد نمایید.'})
  }else{
    setFullNameError({status:false, msg:''})
  }
}
const phoneBlur = () =>{
  setPhoneError({status:false, msg:''})
  if(phone === ''){
    setPhoneError({status:true, msg:'لطفا شماره تماس خود را وارد نمایید!'})
  }else{
    setPhoneError({status:false, msg:''})
  }
}
const emailBlur = () =>{
  setEmailError({status:false, msg:''})
  if(email === ''){
    setEmailError({status:true, msg:'لطفا ایمیل خود را وارد نمایید'})
  }else{
    setEmailError({status:false, msg:''})
  }
}

const typeBlur = () =>{
  setTypeError({status:false, msg:''})
  if(type === ''){
    setTypeError({status:true, msg:'لطفا نوع کاربری خود را انتخاب نمایید.'})
  }else{
    setTypeError({status:false, msg:''})
  }
}
const ruleBlur = () =>{
  setRuleError({status:false, msg:''})
  if(rule === ''){
    setRuleError({status:true, msg:'لطفا نوع دسترسی خود را انتخاب نمایید'})
  }else{
    setRuleError({status:false, msg:''})
  }
}
const provinceBlur = () =>{
  setProvinceError({status:false, msg:''})
  if(province === ""){
    setProvinceError({status:true, msg:'لطفا استان محل فعالیت را انتخاب نمایید!'})
  }else{
    setProvinceError({status:false, msg:''})
  }
}
const passwordBlur = () =>{
  setPasswordError({status:false, msg:''})
  if(password === ''){
    setPasswordError({status:true, msg:'لطفا رمز عبور خود را وارد نمایید'})

  }else{
    const passwordRegex = /^(?=.*[a-zA-Z]).{5,}$/;
    const isValid = passwordRegex.test(password);
    if(isValid){
      setPasswordError({status:false, msg:''})
    }else{
      setPasswordError({status:true, msg:'رمز عبور باید شامل حداقل 5 عدد و یک حرف انگلیسی باشد'})

    }
    
  }
}
const confirmPasswordBlur = () =>{
    setConfirmPasswordError({status:false, msg:''})
  if(confirmPassword === ''){
    setConfirmPasswordError({status:true, msg:'لطفا رمز عبور انتخابی را تکرار کنید!'})
  }else if(confirmPassword !== password){
    setConfirmPasswordError({status:true, msg:'تکرار رمز عبور صحیح نیست!'})
  }else{
    setConfirmPasswordError({status:false, msg:''})
  }
}
const editProfile = async(e)=>{
  e.preventDefault();
  if(fullNameError.status !== true && phoneError.status !== true
    && emailError.status !== true && PasswordError.status !== true
    && confirmPasswordError.status !== true
    ){
      try{
      const response = await axios.post('http://shidcoccm.ir/api/editprofile', {
        FullName : fullName,
        PhoneNumber : phone,
        Email : email,
        Password: password
      })
      notify("تغییرات با موفقیت انجام شد",'success')
    }catch(error){
      notify("خطا",'error')
    }
    }else{
      notify("لطفا همه موارد را به درستی تکمیل کنید!",'error')
    }

}
  return (
    <div className={styles.MainContainer}>
      {isLoading && <LoadingComp />}
      <div className={styles.ProfileContent}>
      {avatar && <img style = {{borderRadius:"15px"}} width = "50%" src = {avatar} alt= "User Avatar" />}
      <input type="file" accept="image/*" onChange={handleFileChange} placeholder='بارگذاری تصویر پروفایل' />
      <Button style={{fontFamily:"iransans"}} variant="contained" onClick={handleUpload}>بارگذاری</Button>
      <ThemeProvider theme={theme}>
       
        <TextField style={{fontFamily:"iransans"}}  onBlur={fullNameBlur}  placeholder='نام کامل' fullWidth
        variant="outlined" type='text' value={fullName}
        error={fullNameError.status} onChange={(e)=>setFullName(e.target.value)} />
        {fullNameError.status && <span style={{color:'red'}}>{fullNameError.msg}</span>}
       
        <TextField style={{fontFamily:"iransans"}} onBlur={phoneBlur} placeholder='شماره تماس' fullWidth
        variant='outlined' type='number' value={phone}
        error={phoneError.status} onChange={(e)=>setPhone(e.target.value)} />
        {phoneError.status && <span color='red'>{phoneError.msg}</span>}
        
        <TextField style={{fontFamily:"iransans"}} onBlur={emailBlur} placeholder='آدرس ایمیل' fullWidth
        variant='outlined' type='text' value={email}
        error={emailError.status} onChange={(e)=>setEmail(e.target.value)} />
        
        <TextField style={{fontFamily:"iransans"}} disabled onBlur={typeBlur} placeholder='نوع دسترسی' fullWidth
        variant='outlined' type='text' value={type} />
        
        <TextField style={{fontFamily:"iransans"}} disabled onBlur={ruleBlur} placeholder='نوع کاربر' fullWidth
        variant='outlined' type='text' value={rule} />
        
        <TextField style={{fontFamily:"iransans"}} disabled onBlur={provinceBlur} placeholder='استان' fullWidth
        variant='outlined' type='text' value={province} />
        
        <TextField style={{fontFamily:"iransans"}} onBlur={passwordBlur} placeholder='رمز عبور جدید' fullWidth
        variant='outlined' type='text' value={password} />
        
        <TextField style={{fontFamily:"iransans"}} onBlur={confirmPasswordBlur} placeholder='تکرار رمز عبور جدید' fullWidth
        variant='outlined' type='text' value={confirmPassword} />
        <Button style={{fontFamily:"iransans"}} onClick={editProfile} type='submit' fullWidth variant="contained">ویرایش اطلاعات</Button>
        </ThemeProvider>
      </div>



    </div>
  )
}

export default Profile

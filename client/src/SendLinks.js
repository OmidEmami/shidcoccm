
import React,{useState} from "react";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import { notify } from "./toast";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from "./App.module.css";
import Logo from "./assests/logoShidco.png";
import axios from "axios";
const SendLinks = ()=> {

const rtlTheme = createTheme({
  direction: 'rtl',
});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('')
  const sendFormData = async (e) =>{
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/sendExhibition",{
        name : name,
        phone : phone
      })

      const data = await response.json();
      console.log(data);
      notify('Data sent successfully','success');
    } catch (error) {
      console.error('Error:', error);
      notify('Failed to send data','error');
    }
  }
  return (
    <ThemeProvider theme={rtlTheme}>
    <div style={{display:"flex", flexDirection:"column", justifyContent:"center",alignContnet:"center", margin:"5rem 20rem 5rem 20rem",direction:"rtl" }}>
      <form style={{display:"flex", flexDirection:"column", justifyContent:"center",alignContnet:"center", rowGap:"1rem"}} onSubmit={sendFormData}>
        <img style={{alignSelf:"center"}} src={Logo} alt="logoShidco" width="20%" />
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center",alignContnet:"center", rowGap:"0.5rem"}}>
        <label>نام مشتری ( آقا یا خانم )</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} style={{padding:"1rem", fontSize:"1rem"}} label="نام مشتری" placeholder="نام مشتری (آقا یا خانم)" />
        </div>
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center",alignContnet:"center",rowGap:"0.5rem"}}>
        <label>شماره تماس</label>
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} style={{padding:"1rem", fontSize:"1rem"}} label="شماره تماس"  placeholder="شماره تماس" />
        </div>
        
        <button  style={{padding:"1rem", fontSize:"1rem", color:"blue", cursor:"pointer"}}  type="submit">ارسال پیامک</button>
          
      </form>
    </div>
    </ThemeProvider>
  );
}

export default SendLinks;

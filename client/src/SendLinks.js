
import React,{useState} from "react";
import { notify } from "./components/toast/toast";

import LoadingComp from "./components/Loading/LoadingComp";
import Logo from "./assests/Logo/logoShidco.png";
import axios from "axios";
const SendLinks = ()=> {
  
  const [disableButton, setDisableButton] = useState(false)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('')
  const sendFormData = async (e) =>{
    e.preventDefault();
    try {
      setDisableButton(true)
      const response = await axios.post("http://shidcoccm.ir/api/sendExhibition",{
        name : name,
        phone : phone
      })
      console.log(response)
      setDisableButton(false)
      notify('موفق','success');
      setName('')
      setPhone('')
    } catch (error) {
      setDisableButton(false)
      console.error('Error:', error);
      notify('خطا','error');
    }
  }
  return (
    <>
    {disableButton && <LoadingComp />}
    <div style={{display:"flex", flexDirection:"column", justifyContent:"center",alignContnet:"center", margin:"5rem 20rem 5rem 20rem",direction:"rtl" }}>
      <form style={{display:"flex", flexDirection:"column", justifyContent:"center",alignContnet:"center", rowGap:"1rem"}} onSubmit={sendFormData}>
        <img style={{alignSelf:"center"}} src={Logo} alt="logoShidco" width="20%" />
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center",alignContnet:"center", rowGap:"0.5rem"}}>
        <label>نام مشتری ( آقا یا خانم )</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} style={{padding:"1rem", fontSize:"1rem", backgroundColor:"#CBD5DE",borderRadius:"15px"}} label="نام مشتری" placeholder="نام مشتری (آقا یا خانم)" />
        </div>
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center",alignContnet:"center",rowGap:"0.5rem"}}>
        <label>شماره تماس</label>
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} style={{padding:"1rem", fontSize:"1rem", backgroundColor:"#CBD5DE",borderRadius:"15px"}} label="شماره تماس"  placeholder="شماره تماس" />
        </div>
        
        <button disabled={disableButton} style={{padding:"1rem", fontSize:"1rem", color:"blue", cursor:"pointer",backgroundColor:"#CBD5DE",borderRadius:"15px"}}  type="submit">ارسال پیامک</button>
          
      </form>
    </div>
    </>
   
  );
}

export default SendLinks;

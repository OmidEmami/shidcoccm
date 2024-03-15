import React,{useEffect,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
export const finalizeOrder = async (cart,username,phone)=>{
  
    try{
        const response = await axios.post("http://localhost:3001/regNewOrder",
        {
            cart:cart,
            UserName:username,
            PhoneNumber:phone
        })
    
    }catch(error){  

    }
}
import React,{useEffect,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { notify } from '../toast/toast';
export const finalizeOrder = async (cart,username,phone)=>{
  
    try{
        const response = await axios.post("http://shidcoccm.ir/api/regNewOrder",
        {
            cart:cart,
            UserName:username,
            PhoneNumber:phone
        })
        return response
    }catch(error){  
        return error
    }
}
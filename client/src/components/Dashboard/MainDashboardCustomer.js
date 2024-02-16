import React,{useState,useEffect} from 'react'
import styles from "./MainDashboardStaff.module.css";
import { jwtDecode } from "jwt-decode";
import Logo from "../../assests/Logo/mainLogoWhite.png";
import { AiOutlineUser } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { MdOutlineNotificationsActive } from "react-icons/md";
import {LiaShippingFastSolid} from "react-icons/lia";
import {RiAdvertisementLine} from "react-icons/ri"
import axios from "axios";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { addToken } from '../../Redux/action';
import LoadingComp from '../Loading/LoadingComp';
import Profile from "../UserStaffComponents/Profile"
import { IoMdExit } from "react-icons/io";
import { useDashboard } from './DashboardContext';
import ChatCustomer from '../UserCustomerComponent/ChatCustomer';
import ProductManagementCustomer from '../UserCustomerComponent/ProductManagementCustomer';
import CheckNotifsCustomer from "../UserCustomerComponent/CheckNotifsCustomer";
import FollowUpOrdersCustomer from "../UserCustomerComponent/FollowUpOrdersCustomer";
import AdverCustomer from "../UserCustomerComponent/AdverCustomer"
import ProductDetailCustomer from '../UserCustomerComponent/ProductDetailCustomer';
const  MainDashboardStaff =()=> {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [expire, setExpire] = useState('');
  const [type, setType] = useState('');
  const [rule, setRule] = useState('')
  // const [item, setItem] = useState(false);
  const { showItem,item } = useDashboard();
  useEffect(() => {
    refreshToken();
    
}, []);

const refreshToken = async () => {
    
    try {
        setIsLoading(true)
        const response = await axios.get('http://localhost:3001/token');
      //  console.log(response)
        setToken(response.data.accessToken);
       
       
        const decoded = jwtDecode(response.data.accessToken);
        
        setName(decoded.name);
        
        setEmail(decoded.email);
        setPhone(decoded.phone)
        setExpire(decoded.exp);
        setType(decoded.type);
        setRule(decoded.rule)
        const token = {userName : decoded.name, realToken:response.data.accessToken}
        dispatch(addToken(token));
        setIsLoading(false)
    } catch (error) {
        setIsLoading(false)
        if (error.response) {
            history.push("/login");
        }
    }
}

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
        setIsLoading(true)
        const response = await axios.get('http://localhost:3001/token');
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        
        setName(decoded.name);
        setEmail(decoded.email);
        setPhone(decoded.phone)
        setExpire(decoded.exp);
        setType(decoded.type);
        setRule(decoded.rule)
        setIsLoading(false)
    }
    return config;
}, (error) => {
    setIsLoading(false)
    Promise.reject(error); 
    return
});
const showItemB = (e) => {
 showItem(e)
}
const logoutSystem = () =>{

}
  return (
    <div className={styles.mainContainer}>
      {isLoading && <LoadingComp />}
        <div className={styles.headerContainer}>
        <img alt='لوگو شیدکو' src={Logo} />
        <h3>سیستم مدیریت ارتباط با مشتریان شیدکو</h3>
        <h4>داشبورد مشتریان شیدکو</h4>
        <h4>کاربر : {name}</h4>
        </div>
        <div className={styles.bodyContainer}>
            <div className={styles.menuRightContainer}>
            <div onClick={()=>showItem(1)} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><AiOutlineUser size='2vw' /><h5>مشاهده و تغییر پروفایل</h5></div>
                <div onClick={()=>showItem(2)} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><BsChatDots size='2vw' /><h5>پیامرسان</h5></div>
                <div onClick={()=>showItem(3)} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><HiOutlineShoppingCart size='2vw' /><h5>ثبت سفارش</h5></div>
                <div onClick={()=>showItem(4)} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><MdOutlineNotificationsActive size='2vw' /><h5>اعلانات</h5></div>
                <div onClick={()=>showItem(5)} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><LiaShippingFastSolid size='2vw' /><h5>پیگیری سفارشات</h5></div>
                <div onClick={()=>showItem(6)} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><RiAdvertisementLine size='2vw' /><h5>محتوای تبلیغاتی</h5></div>
                <div onClick={logoutSystem} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><IoMdExit size='2vw'/><h5>خروج از سیستم</h5></div>
            </div>
            <div className={styles.contentContainer}>
              {item === 1 ? <Profile /> : null}
              {item === 2 ? <ChatCustomer /> : null}
              {item === 3 ? <ProductManagementCustomer /> : null}
              {item === 4 ? <CheckNotifsCustomer /> : null}
              {item === 5 ? <FollowUpOrdersCustomer /> : null}
              {item === 6 ? <AdverCustomer /> : null}
              {item === 8 ? <ProductDetailCustomer /> : null}
            </div>
        </div>
      
    </div>
  )
}

export default MainDashboardStaff

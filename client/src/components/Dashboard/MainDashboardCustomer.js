import React,{useState,useEffect} from 'react'
import styles from "./MainDashboardCustomer.module.css";
import { jwtDecode } from "jwt-decode";
import Logo from "../../assests/Logo/mainLogoWhite.png";
import { AiOutlineUser } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { MdOutlineNotificationsActive } from "react-icons/md";
import {LiaShippingFastSolid} from "react-icons/lia";
import {RiAdvertisementLine} from "react-icons/ri"
import axios from "axios";
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
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Modal from 'react-modal';
import Button from '@mui/material/Button';
import { FaRegSquarePlus } from "react-icons/fa6";
import { FaRegSquareMinus } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, cartModifier,removeFromCart } from '../../Redux/action';
import { finalizeOrder } from '../UserCustomerComponent/FinalizeOrder';
import { notify } from '../toast/toast';
const  MainDashboardStaff =()=> {
  const [showModalCart, setShowModalCart] = useState(false)
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cartReducer.cartItems);
  const history = useHistory();
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
        setPhone(decoded.phoneNumber);
        
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

const logoutSystem = () =>{

}
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90vw', // Limit the width to 90% of the viewport width
    maxHeight: '90vh', // Limit the height to 90% of the viewport height
    overflow: 'auto', // Add scrollbars if content overflows
  },
  overlay: {
    zIndex: 1000
  }
};
const minusQuantity = (variantId, quantity) =>{
 
  if(quantity > 0){
    if(quantity - 1 === 0){
      dispatch(removeFromCart(variantId));
    }else{
  dispatch(cartModifier(variantId, quantity - 1));
}
  }else{
    dispatch(removeFromCart(variantId));
  }
  
}
const plusQuantity = (variantId, quantity) =>{
  dispatch(cartModifier(variantId, quantity + 1));
}
const orderFinalCall = async () => {
  setIsLoading(true);  
  try {
    const response = await finalizeOrder(cartItems, email, phone);
    if (response.status === 200) {
      dispatch({ type: 'RESET_CART' });
      notify("سفارش با موفقیت ثبت شد", 'success');
      setShowModalCart(false);
    }
  } catch (error) {
   
    notify("Failed to finalize the order", 'error');
  }
  setIsLoading(false);  
}
  return (
    <div className={styles.mainContainer}>
      <Modal
       
       isOpen={showModalCart}
       onRequestClose={()=>setShowModalCart(false)}
       style={customStyles}
       contentLabel="add variant modal"
     >
       <div style={{ display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                columnGap: "1vw",
  
                  }}>
                  {cartItems.length === 0 && <h3 style={{color:"black"}}>سبد سفارشات شما خالی است.</h3>}
         {cartItems.length > 0 && cartItems.map((value,index)=>(
          <div className={styles.variantModalContainer}>
          <img alt='variant' style={{width:"16vw"}} src={value.images[0]}/>
          <p>{value.VariantName}</p>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",columnGap:"2vw"}}>
          <FaRegSquareMinus onClick={()=>minusQuantity(value._id, value.quantity)}/>
          <p>{value.quantity}</p>
          <FaRegSquarePlus onClick={()=>plusQuantity(value._id, value.quantity)}/>
          
          </div>
           
          </div>
         ))}

         {cartItems.length > 0 && <Button
  sx={{ fontFamily: "shabnamM" }}
  onClick={orderFinalCall}
  fullWidth
  variant="outlined"
  disabled={isLoading || cartItems.length === 0}  // Disable button if loading or cart is empty
>
  تکمیل سفارش
</Button>}
       </div>
     </Modal>
      {isLoading && <LoadingComp />}
        <div className={styles.headerContainer}>
        <img alt='لوگو شیدکو' src={Logo} />
        <h3>سیستم مدیریت ارتباط با مشتریان شیدکو</h3>
        <h4>داشبورد مشتریان شیدکو</h4>
        <h4>کاربر : {name}</h4>
        <div onClick={()=>setShowModalCart(true)} style={{cursor:"pointer",display:"flex", flexDirection:"row",justifyContent: 'center', alignItems: 'center',columnGap:"1rem"}}>
        
          <h4>سبد خرید</h4>
          <Badge badgeContent={cartItems.length} 
            sx={{
                    '& .MuiBadge-badge': { // Targeting the badge style
                        backgroundColor: '#ff5722', // Custom color for the badge
                        color: 'white' // Optional: change the text color inside the badge
                    }
                }}>
                <ShoppingCartIcon sx={{color:"white", size:"2vw"}} />
            </Badge>
        </div>
        
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

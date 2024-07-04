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
import { CgProfile } from "react-icons/cg";
import { IoChatbubblesOutline } from "react-icons/io5";
import { BiPurchaseTag } from "react-icons/bi";
import { AiTwotoneNotification } from "react-icons/ai";
import { FaUsers } from "react-icons/fa6";
import { MdEditSquare } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { HiOutlineLogout } from "react-icons/hi";
import ChatStaff from '../UserStaffComponents/ChatStaff';
import FollowUpOrdersStaff from '../UserStaffComponents/FollowUpOrdersStaff';
import GroupNotifications from "../UserStaffComponents/GroupNotification"
import AllUserManagement from "../UserStaffComponents/AllUserManagement"
import AllCustomerManagement from "../UserStaffComponents/AllCustomerManagement";
import { ImMakeGroup } from "react-icons/im";
import ProductManagement from '../UserStaffComponents/ProductManagement';
import ProductDetailStaff from '../UserStaffComponents/ProductDetailStaff';
import exit from "../../assests/exit.png";
import cart from "../../assests/cart.png";
import user from "../../assests/user.png";
import fShape from "../../assests/fShape.png";
import LogoShidco from "../../assests/Logo/logoShidco.png";
import messanger from "../../assests/messanger.png";
import orderIcon from "../../assests/orderIcon.png";
import { MdOutlineUploadFile } from "react-icons/md";

import FileUploadComponent from '../UserCustomerComponent/FileUploadComponent';
const  MainDashboardStaff =()=> {
  const [showModalCart, setShowModalCart] = useState(false);
  const [doTrans, setDoTrans] = useState(false)

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
        const response = await axios.get('http://shidcoccm.ir/api/token');
      
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
        const response = await axios.get('http://shidcoccm.ir/api/token');
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
const showItemB = (number) =>{
  showItem(number)
  setDoTrans(true)
}
  return (
    <>
     <div className={styles.mainContainer}>
   <div className={styles.wrapper}>
      <div className={`${styles.circle} ${doTrans ? styles.transCircle : ''}`}>
      <img src={fShape} alt="Shape" className={styles.centerShape} />

      <div className={styles.centerText}>
        <div style={{display:"flex", flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
<img src={LogoShidco}  alt="Shidco Logo" className={styles.centerImage} />
<p style={{fontSize:"1.5rem",width:"100%",margin:"40px"}}>سیستم مدیریت ارتباط با مشتریان</p>
      </div>
        
        </div>
        <div className={styles.iconWrapper}>
          
          <img alt='آیکون' src={user} className={styles.icon} />
          <Badge style={{cursor:"pointer"}} onClick={()=>setShowModalCart(true)}
           badgeContent={cartItems.length} 
            sx={{
                    '& .MuiBadge-badge': { // Targeting the badge style
                        backgroundColor: '#ff5722', // Custom color for the badge
                        color: 'white' // Optional: change the text color inside the badge
                    }
                }}>
                  <img style={{cursor:"pointer"}} onClick={()=>setShowModalCart(true)} alt='آیکون' src={cart} className={styles.icon} />
</Badge>
          
          <img alt='آیکون' src={exit} className={styles.icon} />
        </div>
      </div>
      {item !== null && 
       <div className={styles.centerDiv}>
        
       {item === 1 ? <Profile /> : null}
               {item === 2 ? <ChatStaff /> : null}
               {item === 3 ? <ProductManagementCustomer /> : null}
               {item === 4 ? <CheckNotifsCustomer /> : null}
               {item === 5 ? <FollowUpOrdersCustomer /> : null}
               {item === 6 ? <AdverCustomer /> : null}
               {item === 7 ? <ProductManagement /> : null}
               {item === 8 ? <ProductDetailCustomer /> : null}
               {item === 9 ? <FileUploadComponent /> : null}
               </div>
               }
     

      <div className={styles.circleRight}>
      <div className={styles.columnContainer}> {/* New column container */}
            <div onClick={()=>showItemB(1)} className={styles.columnItem}><CgProfile color='white' size="2vw"/><span style={{color:"white"}}>پروفایل</span></div>
            <div onClick={()=>showItemB(2)} className={styles.columnItem}><IoChatbubblesOutline color='white' size="2vw"/><span style={{color:"white"}}>پیامرسان</span></div>
            <div onClick={()=>showItemB(3)} className={styles.columnItem}><BiPurchaseTag color='white' size="2vw"/><span style={{color:"white"}}>ثبت سفارش</span></div>
            <div onClick={()=>showItemB(4)} className={styles.columnItem}><AiTwotoneNotification color='white' size="2vw"/><span style={{color:"white"}}>اعلانات</span></div>
            <div onClick={()=>showItemB(9)} className={styles.columnItem}><MdOutlineUploadFile color='white' size="2vw"/><span style={{color:"white"}}>بارگذاری فایل</span></div>
            <div onClick={()=>showItemB(5)} className={styles.columnItem}><FaUsers color='white' size="2vw"/><span style={{color:"white"}}>پیگیری سفارشات</span></div>
            <div onClick={()=>showItemB(6)} className={styles.columnItem}><MdEditSquare color='white' size="2vw"/><span style={{color:"white"}}>محتوای تبلیغاتی</span></div>
            <div onClick={()=>showItemB(7)} className={styles.columnItem}><HiOutlineLogout color='white' size="2vw"/><span style={{color:"white"}}>خروج از سیستم</span></div>

          </div>
      </div>
    </div>
      {isLoading && <LoadingComp />}
      
    </div>
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
      
      
    </div>
    </>
  )
}

export default MainDashboardStaff

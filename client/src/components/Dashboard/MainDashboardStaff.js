import React,{useState,useEffect} from 'react'
import styles from "./MainDashboardStaff.module.css";
import { jwtDecode } from "jwt-decode";
import Logo from "../../assests/Logo/mainLogoWhite.png";
import { AiOutlineUser } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { addToken } from '../../Redux/action';
import LoadingComp from '../Loading/LoadingComp';
import Profile from "../UserStaffComponents/Profile"
import ChatStaff from '../UserStaffComponents/ChatStaff';
import FollowUpOrdersStaff from '../UserStaffComponents/FollowUpOrdersStaff';
import GroupNotifications from "../UserStaffComponents/GroupNotification"
import AllUserManagement from "../UserStaffComponents/AllUserManagement"
import AllCustomerManagement from "../UserStaffComponents/AllCustomerManagement";
import { IoMdExit } from "react-icons/io";
import { ImMakeGroup } from "react-icons/im";
import ProductManagement from '../UserStaffComponents/ProductManagement';
import { useDashboard } from './DashboardContext';
import ProductDetailStaff from '../UserStaffComponents/ProductDetailStaff';
import exit from "../../assests/exit.png";
import cart from "../../assests/cart.png";
import user from "../../assests/user.png";
import fShape from "../../assests/fShape.png";
import LogoShidco from "../../assests/Logo/logoShidco.png";
import messanger from "../../assests/messanger.png";
import orderIcon from "../../assests/orderIcon.png";
import { CgProfile } from "react-icons/cg";
import { IoChatbubblesOutline } from "react-icons/io5";
import { BiPurchaseTag } from "react-icons/bi";
import { AiTwotoneNotification } from "react-icons/ai";
import { FaUsers } from "react-icons/fa6";
import { MdEditSquare } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { HiOutlineLogout } from "react-icons/hi";
import FileManager from '../UserStaffComponents/FileManager';


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
  const [doTrans, setDoTrans] = useState(false)
  useEffect(() => {
    refreshToken();
    
}, []);

const refreshToken = async () => {
    
    try {
        setIsLoading(true)
        const response = await axios.get('http://shidcoccm.ir/api/token');
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
const showItemB = (e) => {
 showItem(e)
 setDoTrans(true)
}
const logoutSystem = () =>{

}
  return (
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
          <img alt='آیکون' src={cart} className={styles.icon} />
          <img alt='آیکون' src={exit} className={styles.icon} />
        </div>
      </div>
      {item !== null && 
       <div className={styles.centerDiv}>
        
       {item === 1 ? <Profile /> : null}
               {item === 2 ? <ChatStaff /> : null}
               {item === 3 ? <FollowUpOrdersStaff /> : null}
               {item === 4 ? <GroupNotifications /> : null}
               {item === 5 ? <AllUserManagement /> : null}
               {item === 6 ? <AllCustomerManagement /> : null}
               {item === 7 ? <ProductManagement /> : null}
               {item === 8 ? <ProductDetailStaff /> : null}
               {item === 9 ? <FileManager /> : null}
               </div>
               }
     

      <div className={styles.circleRight}>
      <div className={styles.columnContainer}> {/* New column container */}
            <div onClick={()=>showItemB(1)} className={styles.columnItem}><CgProfile color='white' size="2vw"/><span style={{color:"white"}}>پروفایل</span></div>
            <div onClick={()=>showItemB(2)} className={styles.columnItem}><IoChatbubblesOutline color='white' size="2vw"/><span style={{color:"white"}}>پیامرسان</span></div>
            <div onClick={()=>showItemB(3)} className={styles.columnItem}><BiPurchaseTag color='white' size="2vw"/><span style={{color:"white"}}>بررسی سفارشات</span></div>
            <div onClick={()=>showItemB(4)} className={styles.columnItem}><AiTwotoneNotification color='white' size="2vw"/><span style={{color:"white"}}>اطلاع رسانی گروهی</span></div>
            <div onClick={()=>showItemB(5)} className={styles.columnItem}><FaUsers color='white' size="2vw"/><span style={{color:"white"}}>مدیریت کاربران شیدکو</span></div>
            <div onClick={()=>showItemB(6)} className={styles.columnItem}><MdEditSquare color='white' size="2vw"/><span style={{color:"white"}}>مدیریت مشتریان</span></div>
            <div onClick={()=>showItemB(9)} className={styles.columnItem}><MdEditSquare color='white' size="2vw"/><span style={{color:"white"}}>مدیریت فایل ها</span></div>

            <div onClick={()=>showItemB(7)} className={styles.columnItem}><AiOutlineProduct color='white' size="2vw" /><span style={{color:"white"}}>مدیریت محصولات</span></div>
            <div onClick={()=>showItemB(7)} className={styles.columnItem}><HiOutlineLogout color='white' size="2vw"/><span style={{color:"white"}}>خروج از سیستم</span></div>

          </div>
      </div>
    </div>
      {isLoading && <LoadingComp />}
      
    </div>
  )
}

export default MainDashboardStaff

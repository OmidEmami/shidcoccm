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
import messanger from "../../assests/messanger.png"
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
          
          <img src={user} className={styles.icon} />
          <img src={cart} className={styles.icon} />
          <img src={exit} className={styles.icon} />
        </div>
      </div>
      <div className={styles.centerDiv}>
        
      {item === 1 ? <Profile /> : null}
              {item === 2 ? <ChatStaff /> : null}
              {item === 3 ? <FollowUpOrdersStaff /> : null}
              {item === 4 ? <GroupNotifications /> : null}
              {item === 5 ? <AllUserManagement /> : null}
              {item === 6 ? <AllCustomerManagement /> : null}
              {item === 7 ? <ProductManagement /> : null}
              {item === 8 ? <ProductDetailStaff /> : null}</div> {/* New center div */}

      <div className={styles.circleRight}>
      <div className={styles.columnContainer}> {/* New column container */}
            <div onClick={()=>showItemB(1)} className={styles.columnItem}><img alt="messanger" src={messanger} /><span style={{color:"white"}}>پروفایل</span></div>
            <div onClick={()=>showItemB(2)} className={styles.columnItem}><img alt="messanger" src={messanger} /><span style={{color:"white"}}>پیامرسان</span></div>
            <div onClick={()=>showItemB(3)} className={styles.columnItem}><img alt="messanger" src={messanger} /><span style={{color:"white"}}>بررسی سفارشات</span></div>
            <div onClick={()=>showItemB(4)} className={styles.columnItem}><img alt="messanger" src={messanger} /><span style={{color:"white"}}>اطلاع رسانی گروهی</span></div>
            <div onClick={()=>showItemB(5)} className={styles.columnItem}><img alt="messanger" src={messanger} /><span style={{color:"white"}}>مدیریت کاربران شیدکو</span></div>
            <div onClick={()=>showItemB(6)} className={styles.columnItem}><img alt="messanger" src={messanger} /><span style={{color:"white"}}>مدیریت مشتریان</span></div>
            <div onClick={()=>showItemB(7)} className={styles.columnItem}><img alt="messanger" src={messanger} /><span style={{color:"white"}}>مدیریت محصولات</span></div>
            <div onClick={()=>showItemB(7)} className={styles.columnItem}><img alt="messanger" src={messanger} /><span style={{color:"white"}}>خروج از سیستم</span></div>

          </div>
      </div>
    </div>
      {isLoading && <LoadingComp />}
        {/* <div className={styles.headerContainer}>
        <img alt='لوگو شیدکو' src={Logo} />
        <h3>سیستم مدیریت ارتباط با مشتریان شیدکو</h3>
        <h4>داشبورد کارکنان شیدکو</h4>
        <h4>کاربر : {name}</h4>
        </div> */}
        {/* <div className={styles.bodyContainer}>
            <div className={styles.menuRightContainer}>
                <div onClick={()=>showItemB(1)} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><AiOutlineUser size='2vw' /><h5>مشاهده و تغییر پروفایل</h5></div>
                <div onClick={()=>showItemB(2)} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><BsChatDots size='2vw' /><h5>پیامرسان</h5></div>
                <div onClick={()=>showItemB(3)} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><HiOutlineShoppingCart size='2vw' /><h5>بررسی سفارشات</h5></div>
                <div onClick={()=>showItemB(4)} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><MdOutlineNotificationsActive size='2vw' /><h5>اطلاع رسانی گروهی</h5></div>
                <div onClick={()=>showItemB(5)} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><MdOutlineManageAccounts  size='2vw' /><h5>مدیریت کاربران شیدکو</h5></div>
                <div onClick={()=>showItemB(6)} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><MdManageAccounts size='2vw' /><h5>مدیریت مشتریان</h5></div>
                <div onClick={()=>showItemB(7)} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><ImMakeGroup size='2vw' /><h5>مدیریت محصولات</h5></div>
                <div onClick={logoutSystem} className={`${styles.menuRightContents} ${styles.menuRightContentsHover}`}><IoMdExit size='2vw'/><h5>خروج از سیستم</h5></div>
            </div>
            <div className={styles.contentContainer}>
              {item === 1 ? <Profile /> : null}
              {item === 2 ? <ChatStaff /> : null}
              {item === 3 ? <FollowUpOrdersStaff /> : null}
              {item === 4 ? <GroupNotifications /> : null}
              {item === 5 ? <AllUserManagement /> : null}
              {item === 6 ? <AllCustomerManagement /> : null}
              {item === 7 ? <ProductManagement /> : null}
              {item === 8 ? <ProductDetailStaff /> : null}
            </div>
        </div> */}
      
    </div>
  )
}

export default MainDashboardStaff

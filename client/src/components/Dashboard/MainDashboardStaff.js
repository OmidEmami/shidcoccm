import React from 'react'
import styles from "./MainDashboardStaff.module.css";
import Logo from "../../assests/Logo/mainLogoWhite.png";
import { AiOutlineUser } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";

function MainDashboardStaff() {
  return (
    <div className={styles.mainContainer}>
        <div className={styles.headerContainer}>
        <img alt='لوگو شیدکو' src={Logo} />
        <h3>سیستم مدیریت ارتباط با مشتریان شیدکو</h3>
        <h4>داشبورد کارکنان شیدکو</h4>
        <h4>کاربر : امید امامی</h4>
        </div>
        <div className={styles.bodyContainer}>
            <div className={styles.menuRightContainer}>
                <div className={styles.menuRightContents}><AiOutlineUser size='2vw' /><h5>مشاهده و تغییر پروفایل</h5></div>
                <div className={styles.menuRightContents}><BsChatDots size='2vw' /><h5>پیامرسان</h5></div>
                <div className={styles.menuRightContents}><HiOutlineShoppingCart size='2vw' /><h5>بررسی سفارشات</h5></div>
                <div className={styles.menuRightContents}><MdOutlineNotificationsActive size='2vw' /><h5>اطلاع رسانی گروهی</h5></div>
                <div className={styles.menuRightContents}><MdOutlineManageAccounts  size='2vw' /><h5>مدیریت کاربران شیدکو</h5></div>
                <div className={styles.menuRightContents}><MdManageAccounts size='2vw' /><h5>مدیریت مشتریان</h5></div>

            </div>
            <div className={styles.contentContainer}><h3>omid</h3></div>
        </div>
      
    </div>
  )
}

export default MainDashboardStaff

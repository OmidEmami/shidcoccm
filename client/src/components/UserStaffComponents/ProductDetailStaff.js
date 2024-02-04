import React,{useEffect} from 'react';
import { useDashboard } from '../Dashboard/DashboardContext';
import styles from "./ProductDetailStaff.module.css"
import { GrAddCircle } from "react-icons/gr";
function ProductDetailStaff() {
  const { data } = useDashboard();
  return (
    <div className={styles.mainContainer}>
      <img src={data.image} alt={data.productName} width="200vw" />
      <h3>نام محصول : {data.productName}</h3>
      <h3>دسته بندی : {data.productCategory}</h3>
      <h3>تنوع های این محصول</h3>
      <GrAddCircle size="4vw" />
      اضافه کردن تنوع جدید
      
    </div>
  )
}

export default ProductDetailStaff

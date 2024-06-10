import React,{useEffect,useState} from 'react';
import { useDashboard } from '../Dashboard/DashboardContext';
import styles from "./ProductDetailCustomer.module.css"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import axios from "axios";
import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidLeftArrow } from "react-icons/bi";
import LoadingComp from "../Loading/LoadingComp";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { notify } from '../toast/toast';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, cartModifier,removeFromCart } from '../../Redux/action';
import { FaRegSquarePlus } from "react-icons/fa6";
import { FaRegSquareMinus } from "react-icons/fa6";

import { MdOutlineArrowForward } from "react-icons/md";

function ProductDetailCustomer() {
const { showItem } = useDashboard();
const handleSwitchComponent = (product) => {
    
    showItem(3, product); // Pass the data as the second argument
  };
  const dispatch = useDispatch();
  const [productVariants,setProductsVariant] = useState([])
  const { data } = useDashboard();
  const [showModalVariant,setShowModalVariant] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [variantQuantities, setVariantQuantities] = useState({});
  const [debouncedQuantityUpdate, setDebouncedQuantityUpdate] = useState(null);
  const cartItems = useSelector(state => state.cartReducer.cartItems);
  const handleQuantityChange = (variantId, newQuantity) => {
    const quantity = newQuantity === '' ? 0 : parseInt(newQuantity, 10);

    const newQuantities = {
        ...variantQuantities,
        [variantId]: !isNaN(quantity) ? quantity : 0,
    };

    setVariantQuantities(newQuantities);

    // Save to local storage
    localStorage.setItem('variantQuantities', JSON.stringify(newQuantities));
    setDebouncedQuantityUpdate({ variantId, quantity: newQuantities[variantId] });
};

  
  
  
  
  
useEffect(() => {
  const savedQuantities = localStorage.getItem('variantQuantities');
  if (savedQuantities) {
      setVariantQuantities(JSON.parse(savedQuantities));
  }
}, []);


useEffect(() => {
  if (debouncedQuantityUpdate !== null) {
    const handler = setTimeout(() => {
      updateCartItemQuantity(debouncedQuantityUpdate.variantId, debouncedQuantityUpdate.quantity);
    }, 500); // 500 ms delay

    return () => clearTimeout(handler);
  }
}, [debouncedQuantityUpdate]);
  useEffect(() => {
        
    const fetchData = async()=>{
      setIsLoading(true)
     try{
         const response = await axios.post('http://localhost:3001/getProductVariants',{
          ProductName :data.productName,
          ProductCategory : data.productCategory
         })
         const variantsWithIndex = response.data.map(variant => ({ ...variant, currentIndex: 0 }));
        setProductsVariant(variantsWithIndex);
         
         setIsLoading(false)
         setIsDataFetched(true);
     }catch(error){
      setIsLoading(false)
     }
     
     
    }
    if(showModalVariant === false){
      fetchData();
    }
    
 // eslint-disable-next-line no-use-before-define
 }, [showModalVariant]);
  
  
 
  
 
  const goToPrevious = (variantIndex) => {
    setProductsVariant(currentVariants => currentVariants.map((variant, index) => {
      if (index === variantIndex) {
        const isFirstImage = variant.currentIndex === 0;
        const newIndex = isFirstImage ? variant.images.length - 1 : variant.currentIndex - 1;
        return { ...variant, currentIndex: newIndex };
      }
      return variant;
    }));
  };
  
  const goToNext = (variantIndex) => {
    setProductsVariant(currentVariants => currentVariants.map((variant, index) => {
      if (index === variantIndex) {
        const isLastImage = variant.currentIndex === variant.images.length - 1;
        const newIndex = isLastImage ? 0 : variant.currentIndex + 1;
        return { ...variant, currentIndex: newIndex };
      }
      return variant;
    }));
  };
  
  const addProductVariantToCart = async (value) => {
    // Check if the item is already in the cart
    const isItemInCart = cartItems.some(item => item._id === value._id);
  
    // If the item is not in the cart, initialize its quantity to 1
    if (!isItemInCart) {
      // Update the local state to reflect the new quantity for this variant
      setVariantQuantities(prevQuantities => ({
        ...prevQuantities,
        [value._id]: 1
      }));
  
      // Dispatch the action to add the item with quantity 1 to the Redux store
      dispatch(addToCart({ ...value, quantity: 1 }));
    } else {
      // If the item is already in the cart, you might want to increase its quantity by 1
      // Or simply focus on the fact it's already in the cart, depending on your app's logic
      console.log("Item is already in the cart.");
    }
  };
  const updateCartItemQuantity = (variantId, quantity) => {
    if (quantity > 0) {
        dispatch(cartModifier(variantId, quantity));
    } else {
        // If the quantity is 0 or the field is empty, remove the variant from the cart
        dispatch(removeFromCart(variantId));

        // Also, clean up the local state for this variant
        setVariantQuantities(prevQuantities => {
            const { [variantId]: _, ...newQuantities } = prevQuantities;
            return newQuantities;
        });
    }
};

  const minusQuantity = (variantId) => {
    const currentQuantity = variantQuantities[variantId] ?? cartItems.find(item => item._id === variantId)?.quantity;
    const newQuantity = currentQuantity > 0 ? currentQuantity - 1 : 0;
    handleQuantityChange(variantId, newQuantity);
  };
  
  const plusQuantity = (variantId) => {
    const currentQuantity = variantQuantities[variantId] ?? cartItems.find(item => item._id === variantId)?.quantity;
    handleQuantityChange(variantId, currentQuantity + 1);
  };
  
  
  return (
    <div className={styles.mainContainer}>
      {isLoading && <LoadingComp />}
      
      <div style={{cursor:"pointer",display:"flex",flexDirection:"row", justifyContent:"flexStart",alignItems:"center", backgroundColor:"blue",width:"100%",borderRadius:"10px"}}>
        <MdOutlineArrowForward color='white' size={50} onClick={handleSwitchComponent} />
      <span style={{color:"white"}}>بازگشت</span> 
      </div>
      <div className={styles.MainProductTopContainer}>
     
        <div className={styles.initialDetailsMainProduct}>

      <img style={{borderRadius:"10px"}} src={data.image} alt={data.productName} width="200vw" />
      <div style={{marginTop:"1vw"}}>
      <h3 style={{color:"white"}}>نام محصول : {data.productName}</h3>
      <h3 style={{color:"white"}}>دسته بندی : {data.productCategory}</h3>
      </div>
      </div>
      <div className={styles.secondarMainProductDesc}>
      <h4>{data.productName}</h4>
      <p>{data.productDesc}</p>
      </div>
      </div>
      <div style={{
      height: '1px', // Thickness of the divider line
      width: '100%', // Length of the divider line
      backgroundColor: '#000', // Color of the divider line
    }}></div>
      <h4 style={{margin:"1vw"}}>تنوع های این محصول</h4>
<div className={styles.variantDivider}>
{!isLoading && isDataFetched && productVariants.length === 0 && (
      <div>برای این محصول هیچ تنوعی تعریف نشده است</div>
    )}
{!isLoading && productVariants.length > 0 ? (
  <div className={styles.variantContainer}>
    {productVariants.map((value, index) => (
      <div key={index}>
        {value.images && value.images.length > 0 ? (
          <div className={styles.productVariantContainer}>
            <div className={styles.contentVariantContainer}>
              <BiSolidRightArrow className={styles.icon} color='blue' size="2rem" onClick={() => goToPrevious(index)} />
              <img width="170rem" src={value.images[value.currentIndex]} alt={index} />
              <BiSolidLeftArrow className={styles.icon} color='blue' size="2rem" onClick={() => goToNext(index)} />
            </div>
            <h3 style={{margin:"0.5vw", color:"white"}}>{value.VariantName}</h3>
           {/* Check if the variant exists in the cart */}
        {cartItems.find(item => item._id === value._id) ? (
          // If exists, show the quantity
          <div className={styles.variantQuantityContainer}>
              <div className={styles.mainQuantityContainer}>
                
                <FaRegSquareMinus color="white" onClick={()=>minusQuantity(value._id, variantQuantities[value._id] ?? cartItems.find(item => item._id === value._id)?.quantity)}  size="1.5rem" />
                <input
               style={{ width:"20%", margin:"0vw 1vw 0vw 1vw", borderRadius:"5px"}}
                type='number'
                min='0'
                value={variantQuantities[value._id] ?? ''}
                onChange={(e) => handleQuantityChange(value._id, e.target.value)}
                onBlur={() => updateCartItemQuantity(value._id, variantQuantities[value._id] !== '' ? variantQuantities[value._id] : 0)}
                />


                <FaRegSquarePlus 
                color="white"
                onClick={()=>plusQuantity(value._id, variantQuantities[value._id] ?? cartItems.find(item => item._id === value._id)?.quantity)} 
                size="1.5rem"/>
                </div>
                <span color="white">
                  <p style={{color:"white"}}>                
                    تعداد : {variantQuantities[value._id] ?? cartItems.find(item => item._id === value._id)?.quantity} عدد
                  </p>

                </span>
               

            </div>
        ) : (
          
          <Button style={{fontFamily:"iransans", fontSize:"0.7vw"}} onClick={() => addProductVariantToCart(value)} variant="contained" fullWidth>افزودن به سبد سفارش</Button>
        )}
            
          </div>
        ) : (
          
          <>
            <Skeleton height={170} width={170} />
            <Skeleton width={100} />
          </>
        )}
      </div>
    ))}
  </div>
) : (
  <></>
  
)}

</div>
      
{cartItems.length > 0 && <Button sx={{fontFamily:"shabnamM",backgroundColor:"#1975D1",color:"white"}}  fullWidth variant="outlined">تکمیل سفارش</Button>}
    </div>
  )
}

export default ProductDetailCustomer

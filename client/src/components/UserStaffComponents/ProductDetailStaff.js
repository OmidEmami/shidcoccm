import React,{useEffect,useState} from 'react';
import { useDashboard } from '../Dashboard/DashboardContext';
import styles from "./ProductDetailStaff.module.css"
import { GrAddCircle } from "react-icons/gr";
import Modal from 'react-modal';
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
function ProductDetailStaff() {
  const [productVariants,setProductsVariant] = useState([])
  const { data } = useDashboard();
  const [showModalVariant,setShowModalVariant] = useState(false);
  const [variantName, setVariantName] = useState('');
  const [variantDescription, setVariantDescription] = useState('');
  const [variantImages, setVariantImages] = useState([]);
  const [finalVariantImages, setFinalVariantImages] = useState([])
  const [productColor, setProductColor] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [isDataFetched, setIsDataFetched] = useState(false);
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
  const customStyles = {
      
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      
      
    },
    overlay: {zIndex: 1000}
  };
  
  const handleImageChange = (e) => {
    // console.log(e.target.files)
    if (e.target.files.length > 0) {
      for(let i = 0 ; i < e.target.files.length ; i++){
        const file = e.target.files[i]
        if (file.size > 5 * 1024 * 1024) {
                      alert('فایل باید کمتر از 2MB باشد.');
                      return; // Exit the function if the file is too large
                  }
          if (file.type !== 'image/jpeg') {
                        alert('فقط فایل‌های JPEG مجاز هستند.');
                        return; // Exit the function if the file is not a JPEG
                    }
                    setFinalVariantImages((prevImages)=>[...prevImages,file])
      }
      
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );

     
      setVariantImages((prevImages) => prevImages.concat(filesArray));
      // setFinalVariantImages((prevImages)=>prevImages.concat(file))
      // setMyArray(prevArray => [...prevArray, newItem]);
    }
  

  }
  const renderImages = () => {
    return variantImages.map((image, index) => (
      <img key={index} src={image} alt={`upload-${index}`}  style={{ width: "8rem",padding:"2px" }} />
    ));
  };
  const saveNewVariant = async(e)=>{
    setIsLoading(true)
    e.preventDefault();
    
    const formData = new FormData();
    finalVariantImages.forEach((file) => {
      formData.append('images', file); // Correct for multiple files
  });// Use 'image' as the key for the file
        formData.append('VariantName', variantName);
        formData.append('VariantColor', productColor);
        formData.append('VariantDescription', variantDescription)
        formData.append('productName',data.productName)
        formData.append('productCategory',data.productCategory)
    try{
      const response = await axios.post('http://localhost:3001/addVariantProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
          setIsLoading(false)
          setShowModalVariant(false)
          notify("تنوع محصول جدید اضافه شد",'success')
          setVariantDescription('');
          setVariantName('');
          setProductColor('');
          setFinalVariantImages('')
    }catch(error){
      console.log(error.response.data)
      if(error.response.data.message === 'A product with this name already exists.'){
        notify('این تنوع قبلا اضافه شده است','error')
        setIsLoading(false)
      }else{
        notify("خطا",'error')
        setIsLoading(false)
      }
    }
  }
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
  const showModalForAddVariant = async()=>{
    setShowModalVariant(!showModalVariant)
    setVariantImages([])
  }
  return (
    <div className={styles.mainContainer}>
      {isLoading && <LoadingComp />}
      
      <img src={data.image} alt={data.productName} width="200vw" />
      <h3>نام محصول : {data.productName}</h3>
      <h3>دسته بندی : {data.productCategory}</h3>
      <div style={{
      height: '1px', // Thickness of the divider line
      width: '100%', // Length of the divider line
      backgroundColor: '#000', // Color of the divider line
    }}></div>
      <h4>تنوع های این محصول</h4>
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
            <h3>{value.VariantName}</h3>
            <Button variant="contained" fullWidth>افزودن به سبد سفارش</Button>
          </div>
        ) : (
          // Render Skeletons while loading
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
  // Render Skeletons if productVariants array is empty and data is loading
  // <>
  //   <Skeleton count={5} height={200} width={200} style={{ marginBottom: '10px' }} />
  //   <Skeleton count={5} width={150} style={{ marginBottom: '6px' }} />
  // </>
)}
  <GrAddCircle onClick={showModalForAddVariant} size="4vw" />
      <h3>اضافه کردن تنوع جدید</h3>
</div>
      
      <Modal
       
       isOpen={showModalVariant}
       onRequestClose={()=>setShowModalVariant(false)}
       style={customStyles}
       contentLabel="add variant modal"
     >
       <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
         <form onSubmit={saveNewVariant} className={styles.formContainer}>
          <h1 style={{fontSize:"1.5rem"}}>اضافه کردن تنوع جدید</h1>
          <label>نام تنوع محصول</label>
         <TextField value={variantName} onChange={(e)=>setVariantName(e.target.value)} fullWidth placeholder='نام تنوع'  variant='outlined' />
         <label>توضیحات تنوع</label>
         <TextareaAutosize minRows={3} value={variantDescription}
          onChange={(e)=>setVariantDescription(e.target.value)}
          style={{height:"5vw", width:"20vw"}}
          fullWidth placeholder='توضیحات تنوع' variant='outlined' />
         <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor="raised-button-file">
        <Button style={{backgroundColor:"#EBAB55"}} variant="contained" component="span">
          انتخاب تصویر (حداقل 3 تصویر)
        </Button>
      </label>
      <div>{renderImages()}</div>
      <label>رنگ محصول</label>
      <TextField value={productColor} onChange={(e)=>setProductColor(e.target.value)} fullWidth placeholder='رنگ محصول'  variant='outlined' />
      <Button variant="contained" fullWidth type='submit' >ذخیره</Button>
         </form>
       </div>
     </Modal>
    </div>
  )
}

export default ProductDetailStaff

import React,{useEffect,useState} from 'react';
import { useDashboard } from '../Dashboard/DashboardContext';
import styles from "./ProductDetailStaff.module.css"
import { GrAddCircle } from "react-icons/gr";
import Modal from 'react-modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import axios from "axios";
function ProductDetailStaff() {
  useEffect(() => {
        
    const fetchData = async()=>{
     try{
         const response = await axios.post('http://localhost:3001/getProductVariants',{
          ProductName :data.productName,
          ProductCategory : data.productCategory
         })
         setProductsVariant(response.data)
         setProductsVariant((prevVariant)=>[...prevVariant,response.data])
         
         console.log(response)
     }catch(error){

     }
     
     
    }
    fetchData();
 // eslint-disable-next-line no-use-before-define
 }, []);
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
  const [productVariants,setProductsVariant] = useState([])
  const { data } = useDashboard();
  const [showModalVariant,setShowModalVariant] = useState(false);
  const [variantName, setVariantName] = useState('');
  const [variantDescription, setVariantDescription] = useState('');
  const [variantImages, setVariantImages] = useState([]);
  const [finalVariantImages, setFinalVariantImages] = useState([])
  const [productColor, setProductColor] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0)
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
    e.preventDefault();
    
    const formData = new FormData();
    finalVariantImages.forEach((file) => {
      formData.append('images', file); // Correct for multiple files
  });// Use 'image' as the key for the file
        formData.append('variantName', variantName);
        formData.append('variantColor', productColor);
        formData.append('variantDescription', variantDescription)
        formData.append('productName',data.productName)
        formData.append('productCategory',data.productCategory)
    try{
      const response = await axios.post('http://localhost:3001/addVariantProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    }catch(error){
      console.log(error)
    }
  }
  const goToPrevious = (index) => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? productVariants[index].images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (index) => {
    const isLastImage = currentIndex === productVariants[index].images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  return (
    <div className={styles.mainContainer}>
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
  {productVariants.length > 0 && (
    <div>
      {productVariants.map((value, index) => (
        <div key={index}>
          {value.images && value.images.length > 0 && (
            <>
           
              {console.log(value.images)}
                
                {/* <img width="150rem" key={i} src={image} alt={`variant-${index}-${i}`} /> */}
                <button onClick={()=>goToPrevious(index)}>Previous</button>
      <img width="150rem" src={value.images[currentIndex]} alt={index} />
      <button onClick={()=>goToNext(index)}>Next</button>
     
              
            </>
          )}
        </div>
      ))}
    </div>
  )}
  <GrAddCircle onClick={()=>setShowModalVariant(!showModalVariant)} size="4vw" />
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

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
  const { data } = useDashboard();
  const [showModalVariant,setShowModalVariant] = useState(false);
  const [variantName, setVariantName] = useState('');
  const [variantDescription, setVariantDescription] = useState('');
  const [variantImages, setVariantImages] = useState([]);
  const [finalVariantImages, setFinalVariantImages] = useState([])
  const [productColor, setProductColor] = useState('')
  const handleImageChange = (e) => {
    console.log(e.target.files)
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
    console.log(finalVariantImages)
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
  return (
    <div className={styles.mainContainer}>
      <img src={data.image} alt={data.productName} width="200vw" />
      <h3>نام محصول : {data.productName}</h3>
      <h3>دسته بندی : {data.productCategory}</h3>
      <h4>تنوع های این محصول</h4>
      <GrAddCircle onClick={()=>setShowModalVariant(!showModalVariant)} size="4vw" />
      <h3>اضافه کردن تنوع جدید</h3>
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

import React,{useState,useEffect} from 'react'
import { GrAddCircle } from "react-icons/gr";
import styles from "./ProductManagement.module.css";
import Modal from 'react-modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from "axios";
import { notify } from '../toast/toast';
import { useHistory } from 'react-router-dom';
import { useDashboard } from '../Dashboard/DashboardContext';
function ProductManagement() {
    const history = useHistory();
    const [addProductModal, setAddProductModal] = useState(false)
    const [productName, setProductName] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const [fileHolder, setFileHolder] = useState('');
    const productCategoryList = ['صندلی ها','وایت برد ها','پایه متحرک وایت برد','ماژیک','تابلو اعلانات','میز های مهندسی','تریبون']
    const [products, setProducts] = useState([]);
    const [previousModalState, setPreviousModalState] = useState(addProductModal);
    const [productPreview, setProductPreview] = useState({status:false, image:''});
    const { showItem } = useDashboard();

  const handleSwitchComponent = (product) => {
    
    showItem(8, product); // Pass the data as the second argument
  };
    useEffect(() => {
        
       const fetchData = async()=>{
        try{
            const response = await axios.get('http://localhost:3001/products')
            setProducts(response.data)
        }catch(error){

        }
        
        
       }
       fetchData();
    }, [addProductModal]);
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
      const createNewProduct = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('image', fileHolder); // Use 'image' as the key for the file
        formData.append('productName', productName);
        formData.append('productCategory', productCategory);
        try {
            const response = await axios.post('http://localhost:3001/uploadProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if(response.data.message === 'Product uploaded successfully!'){
                setAddProductModal(false);
                notify("محصول جدید با موفقیت تعریف شد",'success')
            }
        } catch (error) {
            if(error.response.data.message === "A product with this name already exists."){
                notify("این محصول قبلا تعریف شده است",'error')
            }else if(error.response.data.message === "Invalid file type or file too large."){
                notify("سایز و نوع فایل مناسب نیست",'error')
            }
        }
    };
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check if the file size is greater than 2MB
            if (file.size > 2 * 1024 * 1024) {
                alert('فایل باید کمتر از 2MB باشد.');
                return; // Exit the function if the file is too large
            }
    
            // Check if the file is a JPEG
            if (file.type !== 'image/jpeg') {
                alert('فقط فایل‌های JPEG مجاز هستند.');
                return; // Exit the function if the file is not a JPEG
            }
    
            setFileHolder(file); // Update the state with the file name
        }
    };
  return (
    <div className={styles.MainContainer}>
        <Modal
       
       isOpen={addProductModal}
       onRequestClose={()=>setAddProductModal(false)}
       style={customStyles}
       contentLabel="Add New Product"
     >
       <div className={styles.modalContainer}>
         <h3>اضافه کردن محصول جدید</h3>
         <form className={styles.AddProductForm} onSubmit={createNewProduct}>
            <label>نام اصلی محصول</label>
            <TextField required value={productName} onChange={(e)=>setProductName(e.target.value)} fullWidth placeholder='نام اصلی محصول'  variant='outlined' />
            <label>انتخاب دسته بندی محصول</label>
            <Select required sx={{ fontSize: 'large' , fontFamily:"shabnamM",direction:"rtl"}} fullWidth labelId='ProductCategory' id="ProductCategory" label='انتخاب دسته بندی محصول' value={productCategory} onChange={(e)=>setProductCategory(e.target.value)}>
        
          {productCategoryList.map((value,item)=>(
            <MenuItem sx={{ fontSize: 'large' , fontFamily:"shabnamM",direction:"rtl"}} key={item} value={value}>{value}</MenuItem>
          ))}
        </Select>
        <label>توضیحات محصول</label>
        <TextField
          id="outlined-multiline-static"
          label="توضیحات محصول"
          multiline
          rows={4}
          required
        />
        <TextField required onChange={handleFileSelect} placeholder='انتخاب عکس اصلی' type="file" accept=".jpg, .jpeg" />
      <Button type='submit' variant="contained">
        ذخیره
      </Button>
         </form>
       
       
       </div>
     </Modal>
     <div className={styles.wholeProductContainer}>
     {products.length > 0 && products.map(product => (
                    <div className={styles.productContainer} key={product._id}>
                     
                        {product.image && <img onClick={()=>setProductPreview({status:true, image:product.image})}  src={product.image}
                         alt={product.productName} style={{ width: '10rem', cursor:"pointer"}} />}
                        <p>محصول: {product.productName}</p>
                        <p style={{fontSize:"0.8rem"}}>دست بندی : {product.productCategory}</p>
                        <Button onClick={()=>handleSwitchComponent(product)}>اطلاعات بیشتر</Button>
                        </div>
                ))}
        <div onClick={()=>setAddProductModal(!addProductModal)} className={styles.PlusContainer}>
      <GrAddCircle size="4vw" />
      <h3>اضافه کردن محصول جدید</h3>
        </div>
        </div>
        <Modal
       
       isOpen={productPreview.status}
       onRequestClose={()=>setProductPreview({status:false,image:''})}
       style={customStyles}
       contentLabel="Image Preview"
     >
       <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
        
         <img alt='product preview' src={productPreview.image} style={{width:"80%",borderRadius:"10px"}} />
       </div>
     </Modal>
    </div>
  )
}

export default ProductManagement

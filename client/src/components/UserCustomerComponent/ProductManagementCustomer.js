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
function ProductManagementCustomer() {
    const history = useHistory();
    const [addProductModal, setAddProductModal] = useState(false)
    const [products, setProducts] = useState([]);
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
      
    
  return (
    <div className={styles.MainContainer}>
        
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

export default ProductManagementCustomer

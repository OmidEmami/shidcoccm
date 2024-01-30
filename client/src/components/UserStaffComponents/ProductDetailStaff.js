import React,{useEffect} from 'react'
import { useLocation } from 'react-router-dom';
function ProductDetailStaff() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const product = queryParams.get('product');
    const productcat = queryParams.get('productcat')
  return (
    <div>
      <h3>{product}</h3>
      <h3>{productcat}</h3>
    </div>
  )
}

export default ProductDetailStaff

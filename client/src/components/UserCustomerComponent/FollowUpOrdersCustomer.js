import React,{useEffect,useState} from 'react'
import LoadingComp from '../Loading/LoadingComp';
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import FollowUpOrdersCustomerComponent from "./FollowUpOrdersCustomerComponent"
import { notify } from '../toast/toast';
function FollowUpOrdersCustomer() {
  const [isLoading, setIsLoading] = useState(false);
  const realToken = useSelector((state) => state.tokenReducer.token);
  const decoded = jwtDecode(realToken.realToken);
  const [data,setData] = useState([]);
  useEffect(()=>{
    const fetchData = async()=>{
      try{
        setIsLoading(true)
        const response = await axios.post("http://shidcoccm.ir/api/getOrdersCustomer",{
          user:decoded.email
        })
        console.log(response)
        setData(response.data)
        setIsLoading(false)
        console.log(response.data)
      }catch(error){
        notify('خطا در اتصال به شبکه', 'error')
        setIsLoading(false)
      }
    }
    fetchData();
  },[])
  return (
    <div >
      {isLoading && <LoadingComp />}
    <h3 style={{direction:"rtl",color:"black"}}>سفارش های ثبت شده</h3>
      {data.length > 0 ? <FollowUpOrdersCustomerComponent data={data} /> : <p>درحال بارگذاری...</p>}
    </div>
  )
}

export default FollowUpOrdersCustomer

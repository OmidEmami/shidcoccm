import React,{useEffect,useState} from 'react'
import LoadingComp from '../Loading/LoadingComp';
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import FollowUpOrdersStaffComponent from "./FollowUpOrdersStaffComponent"
import { notify } from '../toast/toast';
function FollowUpOrdersStaff() {
  const [isLoading, setIsLoading] = useState(false);
  const realToken = useSelector((state) => state.tokenReducer.token);
  const decoded = jwtDecode(realToken.realToken);
  const [data,setData] = useState([]);
  useEffect(()=>{
    const fetchData = async()=>{
      try{
        setIsLoading(true)
        const response = await axios.post("http://localhost:3001/getOrdersCustomer",{
          user:decoded.email
        })
        // console.log(response)
        setData(response.data)
        setIsLoading(false)
                  const seenIds = new Set();
          const uniqueArray = response.data.filter(item => {
            if (!seenIds.has(item.id)) {
              seenIds.add(item.id);
              return true;
            }
            return false;
          });
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
      {data.length > 0 ? <FollowUpOrdersStaffComponent data={data} /> : <p>درحال بارگذاری...</p>}
    </div>
  )
}

export default FollowUpOrdersStaff

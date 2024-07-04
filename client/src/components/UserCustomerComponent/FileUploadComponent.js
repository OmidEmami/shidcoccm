import React,{useState} from 'react'
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { Button } from '@mui/material';
const FileUploadComponent =()=> {
    const realToken = useSelector((state) => state.tokenReducer.token);
  const decoded = jwtDecode(realToken.realToken);
    const [selectedFile, setSelectedFile] = useState([])
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
      };
      const handleUpload = async () => {
        try {
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('user',decoded.email)
          await axios.post('http://shidcoccm.ir/api/uploadfilecustomer', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          alert('Image uploaded successfully');
        } catch (error) {
          console.error(error);
          alert('Error uploading image');
        }
      };
  return (
    <div>
      <input type="file"  onChange={handleFileChange} placeholder='بارگذاری تصویر پروفایل' />
      <Button style={{fontFamily:"iransans"}} variant="contained" onClick={handleUpload}>بارگذاری</Button>
    </div>
  )
}

export default FileUploadComponent;

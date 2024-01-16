import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import _debounce from 'lodash/debounce';
import { result } from 'lodash';
import Select from 'react-select';
import moment from 'jalali-moment' ;
import TextField from '@mui/material/TextField';
import styles from "./ChatStaff.module.css";
import { useDispatch } from "react-redux";
import { addMessage } from '../../Redux/action';


import { IoSend } from "react-icons/io5";

function ChatStaff() {


  const dispatch = useDispatch();

  const uniqueValues = new Set();
  const ReduxMessages = useSelector((state) => state.addMessageReducer.messages);
  const socket = io('http://localhost:3001');
  const [displaySend, setDisplaySend] = useState('none')
  const [prevSearchQuery, setPrevSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [messageError, setMessageError] = useState({status:false, msg:''})
  const realToken = useSelector((state) => state.tokenReducer.token);
  const decoded = jwtDecode(realToken.realToken);
  socket.emit('join_room', { username: decoded.email });
  // const isMounted = useRef(true);

  const [showChatContentContact, setShowChatContentContact] = useState({status:false, data:'',chatPartner:''})
const [selectedChat,setSelectedChat] = useState('');
const [showMessages, setShowMessages] = useState(false);
  const debouncedFetchData = useRef(_debounce(async (query) => {
    try {
      
      const response = await axios.get(`http://localhost:3001/api/search?query=${query}`);
      // if (isMounted.current) {
        
        setSearchResults(response.data);
        
      // }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }, 300)).current;


    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post('http://localhost:3001/messages', {
            user: decoded.email
          });
    
          setMessages(response.data);
    
          for (let i = 0; i < response.data.length; i++) {
            dispatch(addMessage(response.data[i]));
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
    
      fetchData();
    
      socket.on('new_message', (message) => {
        dispatch(addMessage(message));
    
        setShowChatContentContact((prevState) => {
          const updatedMessages = [...ReduxMessages];
    
          return {
            ...prevState,
            data: updatedMessages,
          };
        });
      });
    
      socket.on('join_room', (data) => {
        socket.join(data.username);
      });
    
      return () => {
        socket.off('join_room');
      };
    }, [dispatch]);
  useEffect(() => {
    
    
    if (searchQuery.trim() !== '') {
     
      
      debouncedFetchData(searchQuery);
    }

    
    return () => {
      debouncedFetchData.cancel();
    };
  }, [searchQuery, debouncedFetchData]);


    const sendMessage = async () => {
      
      if(selectedChat !== ''){
        if(input !== ''){
      socket.emit('send_message', {
        sender: decoded.email,
        receiver:selectedChat.value,
        sendername: decoded.name,
        receivername : selectedChat.label,
        date:moment().locale('fa').format('YYYY-MM-DD HH:mm:ss'),
        message: input,
        
      });
    }else{
      setMessageError({status:true, msg:"پیام نمی تواند خالی باشد!"})
    }
    }else{
      
    }
      setInput('');
    };
const setSendMessage = (e) =>{
  
  if(e === ''){
    setDisplaySend('none')
    
    setInput(e)
  }else{
    setDisplaySend(true)
    setInput(e)
  }
}
const blurChatInput = () =>{
  if(input === ''){
    setDisplaySend('none')
  }else{
    setDisplaySend(true)
  }
}

const showChaterContact = (item) =>{
  setShowMessages(false)
  if(item.sendername !== decoded.name){
    setShowChatContentContact({status:true, data:ReduxMessages,chatPartner : item.sendername})
    setSelectedChat({label:item.sendername ,value:item.sender})
    
    setShowMessages(true)
  }else if(item.receivername !== decoded.name){
    setShowChatContentContact({status:true, data:ReduxMessages,chatPartner : item.receivername})
    
    setSelectedChat({label:item.receivername ,value:item.receiver})
    setShowMessages(true)
  }
  
}
  return (
    <div className={styles.ChatContainer}>
      {console.log(ReduxMessages)}
      <div className={styles.ContactsContent}>
      <Select
       className={styles.selectBox}
        inputValue={searchQuery}
        onInputChange={(e)=>setSearchQuery(e)}
        value={selectedChat}
        onChange={(option) => setSelectedChat(option)}
        options={searchResults.map(result => ({ label: result.FullName, value: result.Email }))}
        isSearchable
        placeholder="جست و جوی کاربر..."
      />
      {ReduxMessages.map((item) => {
        
        if (!uniqueValues.has(item.receivername) && item.receivername !== decoded.name) {
          uniqueValues.add(item.receivername);
          
          return (
            <div onClick={()=>showChaterContact(item)} key={item.date}>
              
              {item.receivername}
            </div>
          );
        }else if(!uniqueValues.has(item.sendername) && item.sendername !== decoded.name){
          uniqueValues.add(item.sendername);
          return (
            <div onClick={()=>showChaterContact(item)} key={item.date}>
              
              {item.sendername}
            </div>
          );
        }
        
       
      })}
      
      </div>
      <div className={styles.chatScreen}>
        {showMessages && <div style={{display:"flex", flexDirection:"column", rowGap:"20px"}}>
          {showChatContentContact.data.map((item,value)=>(
            <div className={item.sendername === decoded.name ? styles.rightMessage : styles.leftMessage} key={value}>
              {item.sendername === decoded.name && item.receivername === showChatContentContact.chatPartner
              || item.receivername === decoded.name && item.sendername === showChatContentContact.chatPartner
              ?  <>{item.message} : {item.sendername}</> : <></>}
              </div>
          ))}
          </div>}
      <div className={styles.ChatSend}><IoSend onClick={sendMessage} display={displaySend} color='blue'/>
      <TextField fullWidth error={messageError.status} onBlur={blurChatInput} value={input} onChange={e => setSendMessage(e.target.value)} variant="standard" placeholder='پیام خود را بنویسید...' />
      </div>
      {messageError.status && <span>{messageError.msg}</span>}
      </div>
      
    </div>
  );
}

export default ChatStaff;
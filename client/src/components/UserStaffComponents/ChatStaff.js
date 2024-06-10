import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import _debounce from 'lodash/debounce';
import Select from 'react-select';
import moment from 'jalali-moment' ;
import TextField from '@mui/material/TextField';
import styles from "./ChatStaff.module.css";




import { IoSend } from "react-icons/io5";
import { notify } from '../toast/toast';
import { RxAvatar } from "react-icons/rx";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'iransans'
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily:"iransans",
          backgroundColor: 'white',
          borderColor:"blue",
          borderRadius:"10px",
          '& label.Mui-focused': {
            color: 'blue',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'blue',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
              border:"none"
              
            },
            '&:hover fieldset': {
              borderColor: 'black',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'blue',
            },
          },
        },
      },
    },
  },
});
function ChatStaff() {


  const [socket, setSocket] = useState(null);
  //const ReduxMessages = useSelector((state) => state.addMessageReducer.messages);
  
  const [displaySend, setDisplaySend] = useState('none')
  const [prevSearchQuery, setPrevSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [messageError, setMessageError] = useState({status:false, msg:''})
  const realToken = useSelector((state) => state.tokenReducer.token);
  const decoded = jwtDecode(realToken.realToken);
  console.log(decoded)
  const [contacts, setContacts] = useState([{}])
  const [showChatContentContact, setShowChatContentContact] = useState('')
  const [selectedChat,setSelectedChat] = useState('');
  const [showMessages, setShowMessages] = useState(false);
  const [avatars, setAvatars] = useState([])
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
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    newSocket.emit('join_room', { username: decoded.email });
    const fetchData = async () => {
    try {
      const response = await axios.post('http://localhost:3001/messages', {
        user: decoded.email
      });

      setContacts((prevContacts) => {
        const uniqueContacts = new Map(prevContacts.map(contact => [contact.name, contact]));
        
        // Add new contacts to the map
        response.data.messages.forEach((message) => {
          if (
            message.receivername !== decoded.name &&
            !uniqueContacts.has(message.receivername)
          ) {
            uniqueContacts.set(message.receivername, { name: message.receivername, user: message.receiver });
          } else if (
            message.sendername !== decoded.name &&
            !uniqueContacts.has(message.sendername)
          ) {
            
            
            uniqueContacts.set(message.sendername, { name: message.sendername, user: message.sender });
          }
        });

        // Convert map values back to an array
        return Array.from(uniqueContacts.values());
      });

      setMessages(response.data.messages);

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
    
      fetchData();
      
      newSocket.on('new_message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      
        const senderName = message.sendername;
      
        setContacts((prevContacts) => {
          // Ensure you're working with the latest state
          const uniqueContacts = new Map(prevContacts.map(contact => [contact.name, contact]));
    
          // Check if senderName is not in contacts and it's not the current user's name
          if (!uniqueContacts.has(senderName) && senderName !== decoded.name) {
            uniqueContacts.set(senderName, { name: senderName, user: message.sender });
            
          }
    
          // Convert map values back to an array
          return Array.from(uniqueContacts.values());
        });
      });
    
      newSocket.on('join_room', (data) => {
        socket.join(data.username);
      });
    
      return () => {
        newSocket.close();
      };
    }, []);
    useEffect(() => {
      const fetchAvatars = async () => {
        const newAvatars = [];
        for (let i = 1; i < contacts.length; i++) {
          try{
            const response = await axios.get(`http://localhost:3001/getavatar/${contacts[i].user}`, { responseType: 'arraybuffer' });
            const blob = new Blob([response.data], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            const obj = { image: imageUrl, user: contacts[i].user };
            newAvatars.push(obj);
          }catch(error){
            console.log(error)
          }
          
        }
    
        setAvatars(newAvatars);
      };
    
      if (contacts.length > 1) {
        fetchAvatars();
      }
    }, [contacts]);
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
      if (!contacts.some(contact => contact.user === selectedChat.value)) {
        
        // If the name does not exist, add it to contacts
        setContacts(prevContacts => [
          ...prevContacts,
          { name: selectedChat.label, user: selectedChat.value } // Replace 'someUserValue' with the appropriate user value
        ]);
      }
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
  setShowChatContentContact(item.name)
  setSelectedChat({value:item.user, label:item.name})

  setShowMessages(true)

  
}
const selectedChatOnScreen = (option)=>{
 if(option.value === decoded.email){
  notify('نمی توانید به خودتان پیام بدهید','error')
 }else{
  setSelectedChat(option)
  setShowChatContentContact(option.label)
  setShowMessages(true)
 }
 
}
const handleKeyDown = (e) => {
  if (e.key === 'Enter' && input.trim() !== '') {
    e.preventDefault(); // Prevent the default action to avoid form submission or other unwanted behaviors
    sendMessage();
  }
};
  return (
    <ThemeProvider theme={theme}>

    <div>
      <div className={styles.topChatHeader}>
        {showChatContentContact !== '' && 
        <div style={{display:"flex", flexDirection:"row", justifyContent: 'flexStart', alignItems:"center",columnGap:"1rem", margin:"0vw 1vw 0vw 1vw"}}>
          <RxAvatar size={40} color='white' />
          <p style={{color:"white", fontSize:"1vw"}}>{showChatContentContact}</p>
        </div>
        }

      </div>
    <div className={styles.ChatContainer}>
    
      <div className={styles.ContactsContent}>
      <Select
        className={styles.selectBox}
        inputValue={searchQuery}
        onInputChange={(e)=>setSearchQuery(e)}
        value={selectedChat}
        onChange={(option) => selectedChatOnScreen(option)}
        options={searchResults.map(result => ({ label: result.FullName, value: result.Email }))}
        isSearchable
        placeholder="جست و جوی کاربر..."
      />
      {contacts.length > 0 && contacts.map((item,index)=>(
        <>
        

        {avatars.length > 0 && avatars.map((data,key)=>(
          <>
          {data.user === item.user && <div className={styles.contanctContainerFinal} onClick={()=>showChaterContact(item)} key={index}>
          <img alt='omid' src={data.image} />
            <h3>{item.name}</h3>
        
        </div>}
        
        </>
        )) }
         
        
        </>
        
      ))}

      
      </div>
      <div className={styles.chatScreen}>
      {showMessages && (
  <div style={{ display: 'flex', flexDirection: 'column', rowGap: '20px' }}>
    {messages
      .filter((item) => {
        return (
          (item.sendername === decoded.name && item.receivername === showChatContentContact) ||
          (item.receivername === decoded.name && item.sendername === showChatContentContact)
        );
      })
      .map((item, value) => (
        <div
          className={item.sendername === decoded.name ? styles.rightMessage : styles.leftMessage}
          key={value}
        >
          {item.sendername === decoded.name ? <div className={styles.finalMessage}>{item.message} : {item.sendername}<span className={styles.blueDot}></span></div> : <div><span className={styles.redDot}></span>{item.sendername} : {item.message}</div>}
        </div>
      ))}
  </div>
)}
      <div className={styles.ChatSend}><IoSend onClick={sendMessage} size={30} display={displaySend} color='blue'/>
      <TextField onKeyDown={handleKeyDown} fullWidth error={messageError.status} onBlur={blurChatInput} value={input} onChange={e => setSendMessage(e.target.value)} variant="standard" placeholder='پیام خود را بنویسید...' />
      </div>
      {messageError.status && <span>{messageError.msg}</span>}
      </div>
      
    </div>
    </div>
    </ThemeProvider>

  );
}

export default ChatStaff;
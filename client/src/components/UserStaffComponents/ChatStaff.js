import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import _debounce from 'lodash/debounce';
import { result } from 'lodash';
import Select from 'react-select';
function ChatStaff() {
  const socket = io('http://localhost:3001');
 
  const [prevSearchQuery, setPrevSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const realToken = useSelector((state) => state.tokenReducer.token);
  const decoded = jwtDecode(realToken.realToken);
  socket.emit('join_room', { username: decoded.email });
  const isMounted = useRef(true);
const [selectedChat,setSelectedChat] = useState('')
  const debouncedFetchData = useRef(_debounce(async (query) => {
    try {
      console.log(query);
      const response = await axios.get(`http://localhost:3001/api/search?query=${query}`);
      if (isMounted.current) {
        console.log("omid2");
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }, 300)).current;

  useEffect(() => {
    // Fetch initial messages only when the component mounts
    axios.post('http://localhost:3001/messages', {
      user: decoded.email
    }).then(response => {
      if (isMounted.current) {
        setMessages(response.data);
      }
    });

    // Listen for new messages
    socket.on('new_message', (message) => {
      if (isMounted.current) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });
  
    // Listen for the join_room event
    socket.on('join_room', (data) => {
      // Join the room named after the user's username
      socket.join(data.username);
    });
  
    // Cleanup the socket listener when the component unmounts
    return () => {
      isMounted.current = false;
      socket.off('new_message');
      socket.off('join_room');
    };
  }, []);
  useEffect(() => {
    // Call the debounced function when the searchQuery changes
    console.log(searchQuery)
    if (searchQuery.trim() !== '') {
      console.log("omid3");
      console.log(searchQuery);
      debouncedFetchData(searchQuery);
    }

    // Cleanup function to cancel the debounced function
    return () => {
      debouncedFetchData.cancel();
    };
  }, [searchQuery, debouncedFetchData]);


    //console.log(decoded.email);
    // const response = await axios.post('http://localhost:3001/newChat', {
    //   data: {
    //     username: decoded.email,
    //     message: input,
    //     name: decoded.name
    //   },
    //   collectionName: decoded.email
    // });
    // console.log(response.data);
    // console.log(decoded.email);
    const sendMessage = async () => {
      socket.emit('send_message', {
        username: decoded.email,
        name: decoded.name,
        message: input,
        UserID: decoded.email
      });
      setInput('');
    };
  

  return (
    <div>
      {messages.map((message, index) => (
        <p key={index}><strong>{message.name}</strong>: {message.message}</p>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      
 <Select
 inputValue={searchQuery}
 onInputChange={(e)=>setSearchQuery(e)}
        value={selectedChat}
        onChange={(option) => setSelectedChat(option)}
        options={searchResults.map(result => ({ label: result.FullName, value: result.id }))}
        isSearchable
        placeholder="Search..."
      />
    </div>
  );
}

export default ChatStaff;
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3001');

function ChatStaff() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Fetch initial messages only when the component mounts
    axios.get('http://localhost:3001/messages').then(response => {
      setMessages(response.data);
    });

    // Listen for new messages
    socket.on('new_message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Cleanup the socket listener when the component unmounts
    return () => {
      socket.off('new_message');
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const sendMessage = () => {
    socket.emit('send_message', {
      username: 'User',
      message: input
    });
    setInput('');
  };

  return (
    <div>
      {messages.map((message, index) => (
        <p key={index}><strong>{message.username}</strong>: {message.message}</p>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatStaff;
import { Server } from "socket.io";
import mongoose from 'mongoose';

const ChatUserSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  sendername: String,
  receivername: String,
  date: Date,
  message: String,
});

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
          origin: "http://localhost:3000", // Client's address
          methods: ["GET", "POST"],
          credentials: true,
        },
      });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join_room', (data) => {
      socket.join(data.username);
    });

    socket.on('sendTestMessage', (data) => {
      io.emit('receiveMessage', data);
    });

    socket.on('send_message', async (data) => {
      const collectionName = data.sender + 's';
      const collectionNameNd = data.receiver + 's';

      try {
        const ChatUser = mongoose.models[collectionName] || mongoose.model(collectionName, ChatUserSchema);
        const ChatUserNd = mongoose.models[collectionNameNd] || mongoose.model(collectionNameNd, ChatUserSchema);

        const newData = new ChatUser(data);
        const newDataNd = new ChatUserNd(data);

        await newData.save();
        await newDataNd.save();

        io.to(data.sender).emit('new_message', data);
        io.to(data.receiver).emit('new_message', data);

        console.log('Data added successfully');
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
};
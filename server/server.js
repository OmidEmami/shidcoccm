import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Routes/index.js";
import bodyParser from "body-parser";
import http from "http";
import multer from "multer";
import moment from 'jalali-moment';
import path from "path";
import fs from 'fs';
import axios from "axios";
import mongoose from 'mongoose'; // Add this
import { Server } from "socket.io"; // Add this
import {MongoClient} from "mongodb"
import Users from "./Models/Users.js";


import { Sequelize, col } from "sequelize";
const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:3001','http://localhost:3001/socket.io'],
     // Replace with your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're using cookies or sessions
  };
const app = express();
app.use(cors(corsOptions));
const server = http.createServer(app);
const io = new Server(server);

  
  
 
  dotenv.config();
 // Add this


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
// mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});

const DB_URL = "mongodb://127.0.0.1:27017/Shidcoccm";
const DB_NAME = "Shidcoccm";
const client = new MongoClient(DB_URL);
async function main(){
  await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("connected to mongodb");
    const db = mongoose.connection;
    const userCollection = db.collection("Shidcoccm");
    const respond = await userCollection.find({}).toArray();

}




io.on('connection', (socket) => {
  socket.on('join_room', (data) => {
    // Join the room named after the user's username
    socket.join(data.username);
  });
  socket.on('sendTestMessage', async(data)=>{
    io.emit('receiveMessage',data)
  })
  socket.on('send_message', async(data) => {
  
    // const message = new Message(data);
    // console.log(data)
    const collectionName = data.sender + 's';
    const collectionNameNd = data.receiver + 's';
    

  try {
    // MongoDB connection
    const db = mongoose.connection.db; // Access the underlying MongoDB database object
      const ChatUserSchema = new mongoose.Schema({
        sender: String,
        receiver:String,
        sendername: String,
        receivername : String,
        date:Date,
        message: String,
      });
      const ChatUserSchemaNd = new mongoose.Schema({
        sender: String,
        receiver:String,
        sendername: String,
        receivername : String,
        date:Date,
        message: String,
      })
      const ChatUser = mongoose.models[collectionName] || mongoose.model(collectionName, ChatUserSchema);
      const ChatUserNd = mongoose.models[collectionNameNd] || mongoose.model(collectionNameNd, ChatUserSchemaNd);
      const newData = new ChatUser(data);
      const newDataNd = new ChatUserNd(data)
      const { sender, receiver } = data;
      await newData.save().then(() => {
         newDataNd.save()
          io.to(sender).emit('new_message', data);
          io.to(receiver).emit('new_message', data);
        
       
      });
      console.log('Data added successfully');


  } catch (error) {
    console.error('Error:', error);
   
  }

  });
});
app.post('/messages', async (req, res) => {
  try {
    const ChatUserSchema = new mongoose.Schema({
      sender: String,
      receiver:String,
      sendername: String,
      receivername : String,
      date:Date,
      message: String,
    })
    const collName = req.body.user + 's'
    
    const OmidUser =mongoose.models[collName] || mongoose.model(collName, ChatUserSchema);
    
    const messages = await OmidUser.find({});
    res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});


app.get('/api/search', async(req, res) => {
  const query = req.query.query.toLowerCase();

  // Filter names that start with the search query
  try {
    // Use Sequelize to find users with names starting with the search query
    const results = await Users.findAll({
      where: {
        FullName: {
          [Sequelize.Op.like]: `${query}%`,
        },
      },
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  
});
const PORT = process.env.PORT || 3001;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
server.listen(PORT,'0.0.0.0', ()=> console.log('Server running at port 3001'));
main();






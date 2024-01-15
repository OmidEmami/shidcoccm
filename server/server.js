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
const app = express();
const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:3001','http://localhost:3001/socket.io'],
     // Replace with your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're using cookies or sessions
  };
  
  
  app.use(cors(corsOptions));
  dotenv.config();
const server = http.createServer(app);
const io = new Server(server); // Add this


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
    console.log(respond)
}
// async function main(){
//   await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
//   console.log("connected to mongodb");
//   const db = mongoose.connection;
//   const userCollection = db.collection("Shidcoccm");
//   const respond = await userCollection.find({}).toArray();
//   console.log(respond)
// }
const MessageSchema = new mongoose.Schema({
  username: String,
  message: String,
  name :String,
  UserID:String
});

const Message = mongoose.model('Message', MessageSchema);

// const Users = mongoose.model('Users', UserSchema);
// const Users = mongoose.model('Message', MessageSchema);
io.on('connection', (socket) => {
  socket.on('join_room', (data) => {
    // Join the room named after the user's username
    socket.join(data.username);
  });
  socket.on('send_message', async(data) => {
    console.log(data)
    // const message = new Message(data);
    // console.log(data)
    const collectionName = data.username + 's';

  try {
    // MongoDB connection
    const db = mongoose.connection.db; // Access the underlying MongoDB database object
    const collections = await db.listCollections().toArray();
    //const collectionExists = collections.some(collection => collection.name === collectionName);

   
      

      // Mongoose connection

      // Define schema
      const ChatUserSchema = new mongoose.Schema({
        username: String,
        message: String,
        name: String
      });

      // Create a model based on the schema
      const ChatUser = mongoose.models[collectionName] || mongoose.model(collectionName, ChatUserSchema);

      // Create a new instance of the model with the data you want to add
      const newData = new ChatUser(data);
      const { username, message } = data;
      // Save the new data to the database
      await newData.save().then(() => {
        // io.emit('new_message', data);
        io.to(username).emit('new_message', data);
      });
      console.log('Data added successfully');

      // Close Mongoose connection
      // await mongoose.connection.close();
    

    // Close MongoDB connection
    // await client.close();
// response.json("send")
    // res.json("send");
  } catch (error) {
    console.error('Error:', error);
    // response.status(500).json({ error: 'Internal Server Error' });
  }
    // message.save()
  });
});
app.post('/messages', async (req, res) => {
  try {
    const ChatUserSchema = new mongoose.Schema({
      username: String,
      message: String,
      name: String
    })
    const collName = req.body.user + 's'
    const OmidUser =mongoose.models[collName] || mongoose.model(collName, ChatUserSchema);
    console.log(mongoose.models[collName]);
    const messages = await OmidUser.find({username : req.body.user});
    res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
app.post('/newChat', async (req, res) => {
  const collectionName = req.body.collectionName + 's';

  try {
    // MongoDB connection
    const db = mongoose.connection.db; // Access the underlying MongoDB database object
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some(collection => collection.name === collectionName);

   
      

      // Mongoose connection

      // Define schema
      const ChatUserSchema = new mongoose.Schema({
        username: String,
        message: String,
        name: String
      });

      // Create a model based on the schema
      const ChatUser = mongoose.models[collectionName] || mongoose.model(collectionName, ChatUserSchema);

      // Create a new instance of the model with the data you want to add
      const newData = new ChatUser({
        username: req.body.data.username,
        message: req.body.data.message,
        name: req.body.data.name
      });

      // Save the new data to the database
      await newData.save();
      console.log('Data added successfully');

      // Close Mongoose connection
      // await mongoose.connection.close();
    

    // Close MongoDB connection
    // await client.close();

    res.json("send");
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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






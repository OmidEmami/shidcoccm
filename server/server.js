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
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server); // Add this
const corsOptions = {
    origin: ['http://localhost:3000']
    , // Replace with your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're using cookies or sessions
  };
  
app.use(cors(corsOptions));
app.use(cookieParser());
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
  message: String
});

const Message = mongoose.model('Message', MessageSchema);
io.on('connection', (socket) => {
  socket.on('send_message', (data) => {
    
    const message = new Message(data);
    console.log(data)
    message.save().then(() => {
      io.emit('new_message', data);
    });
  });
});
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find({});
    res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
const PORT = process.env.PORT || 3001;
app.use(cookieParser());
app.use(express.json());
app.use(router);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
server.listen(PORT,'0.0.0.0', ()=> console.log('Server running at port 3001'));
main();
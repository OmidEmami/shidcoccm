import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Routes/index.js";
import bodyParser from "body-parser";
import http from "http";
import multer from "multer";
import mongoose from 'mongoose'; // Add this
import { Server } from "socket.io"; // Add this
import { initSocket } from "./Controllers/Chat/NewChat.js";
const corsOptions = {
  origin: ['http://localhost:3000'],
     // Replace with your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're using cookies or sessions
  };
const app = express();
app.use(cors(corsOptions));
const server = http.createServer(app);
  dotenv.config();
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// If you're also handling URL-encoded data, set a higher limit for that as well
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(router);
// mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});
const DB_URL = "mongodb://127.0.0.1:27017/Shidcoccm";
async function main(){
  await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("connected to mongodb");
    const db = mongoose.connection;
  
    

}

initSocket(server);

const PORT = process.env.PORT || 3002;




server.listen(PORT,'0.0.0.0', ()=> console.log('Server running at port 3002'));
main();






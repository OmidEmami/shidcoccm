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
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
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
const imageSchema = new mongoose.Schema({
  user: String,
  avatar: {
    type: Buffer,
  },
});

const Image = mongoose.models['Image'] || mongoose.model('Image', imageSchema);
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
    
    res.status(200).json({messages});
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

app.post('/uploadavatar', upload.single('image'), async (req, res) => {
  console.log(req.file);

  try {
    const userEmail = req.body.user;
    
    // Find the existing image for the user
    const existingImage = await Image.findOne({ user: userEmail });

    // If there's an existing image, delete it
    if (existingImage) {
      await existingImage.deleteOne();
    }

    // Create a new image with the uploaded file
    const newImage = new Image({
      avatar: req.file.buffer,
      user: userEmail,
    });

    // Save the new image
    await newImage.save();

    res.status(201).send('Image uploaded successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/getavatarall', async (req, res) => {
  try {
    
    const image = await Image.find({});

    if (!image) {
      return res.status(404).send('Image not found');
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(image);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/getavatar/:user', async (req, res) => {
  try {
    const user = req.params.user;
    const image = await Image.findOne({ user: user });

    if (!image) {
      return res.status(404).send('Image not found');
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(image.avatar);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
const ProductSchema = new mongoose.Schema({
  productName: { type: String, unique: true },
  productCategory: String,
  image: Buffer,
});

const Product = mongoose.model('Product', ProductSchema);
app.post('/uploadProduct', (req, res) => {
  // Define multer storage and file filter within the route
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
      if (file.mimetype === 'image/jpeg') {
          cb(null, true); // Accept file
      } else {
          cb(null, false); // Reject file
          cb(new Error('Only JPEG files are allowed')); // Optionally pass an error message
      }
  };

  const upload = multer({ 
      storage: storage, 
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
      fileFilter: fileFilter 
  }).single('image');

  // Execute multer within the route to handle file upload
  upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading
          return res.status(500).json({ message: err.message });
      } else if (err) {
          // An unknown error occurred when uploading
          return res.status(500).json({ message: "An error occurred during the file upload." });
      }

      // Check if file was received
      if (!req.file) {
          return res.status(400).json({ message: "Invalid file type or file too large." });
      }

      // Proceed with your existing logic here, req.file is the uploaded file
      try {
          const { productName, productCategory } = req.body;
          const existingProduct = await Product.findOne({ productName: productName });

          if (existingProduct) {
              return res.status(400).json({ message: "A product with this name already exists." });
          }

          const image = req.file.buffer;
          const newProduct = new Product({ productName, productCategory, image });
          await newProduct.save();

          res.status(201).json({ message: "Product uploaded successfully!", newProduct });
      } catch (error) {
          console.error(error);
          res.status(500).send('Error uploading product');
      }
  });
});
app.get('/products', async (req, res) => {
  try {
      const products = await Product.find({}); // Fetch all products from the database

      // Convert each product's image from Buffer to a string that can be used as a src for an <img> tag
      const productsWithImages = products.map(product => {
          const image = product.image ? `data:image/jpeg;base64,${product.image.toString('base64')}` : null;
          return { ...product.toObject(), image: image };
      });

      res.json(productsWithImages);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});
const PORT = process.env.PORT || 3001;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
server.listen(PORT,'0.0.0.0', ()=> console.log('Server running at port 3001'));
main();






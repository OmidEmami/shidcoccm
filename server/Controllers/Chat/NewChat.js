// import { MongoClient } from 'mongodb';

// import { Server } from "socket.io"; // Add this

// export const newChat = async (req, res) => {
//   const url = 'mongodb://localhost:27017';
//   const dbName = 'Shidcoccm';
//   const collectionName = req.body.collectionName + 's';

//   try {
//     // MongoDB connection
//     const client = new MongoClient(url, { useUnifiedTopology: true });
//     await client.connect();
//     const db = client.db(dbName);
//     const collections = await db.listCollections().toArray();
//     const collectionExists = collections.some(collection => collection.name === collectionName);

//     if (collectionExists) {
//       console.log(`Collection '${collectionName}' exists.`);

//       // Mongoose connection
//       await mongoose.connect(`${url}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

//       // Define schema
//       const ChatUserSchema = new mongoose.Schema({
//         username: String,
//         message: String,
//         name: String
//       });

//       // Create a model based on the schema
//       const ChatUser = mongoose.models[collectionName] || mongoose.model(collectionName, ChatUserSchema);

//       // Create a new instance of the model with the data you want to add
//       const newData = new ChatUser({
//         username: req.body.data.username,
//         message: req.body.data.message,
//         name: req.body.data.name
//       });

//       // Save the new data to the database
//       await newData.save();
//       console.log('Data added successfully');

//       // Close Mongoose connection
//       await mongoose.connection.close();
//     } else {
//       console.log(`Collection '${collectionName}' does not exist.`);
//     }

//     // Close MongoDB connection
//     await client.close();

//     res.json("send");
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// // const OmidSchema = new mongoose.Schema({
// //   username: String,
// //   message: String,
// //   name :String
// // });

// // const Omid = mongoose.model(`${req.body.collectionName}`, OmidSchema);
// // const message = new Omid(req.body.data);
// // message.save();




// // Database Name



// // Connect to the server


//   // Select the database
// //   const db = client.db(dbName);
// // db.listCollections().toArray((err, collections) => {
// //     if (err) {
// //       console.error('Error listing collections:', err);
// //       return client.close();
// //     }

// //     // Check if the specified collection exists
// //     const collectionExists = collections.some(collection => collection.name === collectionName);

// //     if (collectionExists) {
// //       console.log(`Collection '${collectionName}' exists.`);
// //     } else {
// //       console.log(`Collection '${collectionName}' does not exist.`);
// //     }




// // const corsOptions = {
// //   origin: ['http://localhost:3000','http://localhost:3001','http://localhost:3001/socket.io'],
// //      // Replace with your frontend domain
// //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// //     credentials: true, // If you're using cookies or sessions
// //   };
  
// //   const app = express();
// //   app.use(cors(corsOptions));
// //   dotenv.config();
// // const server = http.createServer(app);
// // const io = new Server(server); // Add this


// // app.use(cookieParser());
// // // mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});

// // const DB_URL = "mongodb://127.0.0.1:27017/Shidcoccm";
// // const DB_NAME = "Shidcoccm";
// // const client = new MongoClient(DB_URL);
// // async function main(){
// //   await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
// //     console.log("connected to mongodb");
// //     const db = mongoose.connection;
// //     const userCollection = db.collection("Shidcoccm");
// //     const respond = await userCollection.find({}).toArray();
// //     console.log(respond)
// // }
// // // async function main(){
// // //   await mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
// // //   console.log("connected to mongodb");
// // //   const db = mongoose.connection;
// // //   const userCollection = db.collection("Shidcoccm");
// // //   const respond = await userCollection.find({}).toArray();
// // //   console.log(respond)
// // // }
// // const MessageSchema = new mongoose.Schema({
// //   username: String,
// //   message: String,
// //   name :String
// // });

// // const Message = mongoose.model('Message', MessageSchema);
// // const UserSchema = new mongoose.Schema({
// //   Email: String
// // })
// // const Users = mongoose.model('Users', UserSchema);
// // // const Users = mongoose.model('Message', MessageSchema);
// // io.on('connection', (socket) => {
// //   socket.on('send_message', (data) => {
    
// //     const message = new Message(data);
// //     console.log(data)
// //     message.save().then(() => {
// //       io.emit('new_message', data);
// //     });
// //   });
// // });
// // app.get('/messages', async (req, res) => {
// //   try {
// //     const messages = await Message.find({});
// //     res.status(200).json(messages);
// //   } catch (err) {
// //     console.log(err);
// //     res.status(500).send(err);
// //   }
// // });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { router : userRouter } = require('./src/routes/users');
const noteRouter = require('./src/routes/notes');
const http = require("http");
const socketIO = require('socket.io');


const app = express();
const server = http.createServer(app);
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const CORS_ORIGIN = process.env.CORS_ORIGIN;
const DATABASE_URL = process.env.DATABASE_URL;
const dbName = "PasswordNoteApp";
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === CORS_ORIGIN || origin.startsWith(CORS_ORIGIN)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

//Middlewares
app.use(express.json());
app.use(cors(corsOptions));


const io = socketIO(server, {
  cors: corsOptions,
});

io.on("connection", (socket) => {
    //console.log(`User Connected: ${socket.id}`);

    socket.on("newUser", (userID) => {
      // Join a room using the user's ID
      socket.join(userID);
      //console.log(`User with ID: ${socket.id} joined : ${userID}`);
    });

    socket.on("sendNotification", ({ senderName, receiverID, message }) => {
      io.to(receiverID).emit("getNotification", {
        senderName,
        message,
      });
    });
  
    socket.on("disconnect", () => {
      //console.log("User Disconnected", socket.id);
    });
});

// auth is an Endpoint
app.use("/auth" , userRouter );

// password is an Endpoint
app.use("/notes" , noteRouter);


//Connecting to the Local Database
//const path = "mongodb://localhost:27017/PasswordManagerApp";
//const path = "mongodb+srv://akhilmaddineni23:akhil23@cluster0.ta6cikv.mongodb.net/" + dbName + "?retryWrites=true&w=majority";
const path = `${DATABASE_URL}/${dbName}?retryWrites=true&w=majority`;
mongoose.connect( path , {useNewUrlParser : true})
.then(() => console.log("Connected to MongoDB Database:"))
.catch((err) => console.log("Error while connecting Database = ",err))


//Connecting to the express server
server.listen(PORT , ()=> console.log(`Server is Listening on Port ${PORT}`));


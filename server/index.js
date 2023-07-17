const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { router : userRouter } = require('./src/routes/users');
const noteRouter = require('./src/routes/notes');


const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

// auth is an Endpoint
app.use("/auth" , userRouter );

// password is an Endpoint
app.use("/notes" , noteRouter);


//Connecting to the Local Database
const path = "mongodb://localhost:27017/PasswordManagerApp";
mongoose.connect( path , {useNewUrlParser : true})
.then(() => console.log("Connected to MongoDB Database:"))
.catch((err) => console.log("Error while connecting Database = ",err))


//Connecting to the express server
app.listen(5000 , ()=> console.log("Server is Listening on Port 5000"));
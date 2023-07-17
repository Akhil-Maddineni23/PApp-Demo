const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel  = require('../models/Users.js');

const router = express.Router();

router.post("/emailcheck" , async (req , res) => {
  const email = req.body.email;

  const user = await UserModel.findOne({email : email });
  if(user){
      return res.json({exists : true , message : "Email Id already Exists"});
  }
  return res.json({ exists : false , message : "Email Id doesn't Exists"});
});


router.post("/register" , async (req , res) => {
    const {email , password , username } = req.body;

    const hashedPassword = await bcrypt.hash(password , 10);
    const newUser = new UserModel({
        email , password : hashedPassword , username
    });
    newUser.save();
    return res.json({ status : true , message : "User Registered Successfully!!"});
});

router.post("/login" , async (req , res) => {
    const {email , password} = req.body;
    const user = await UserModel.findOne({email : email});
  
    if(!user){
        return res.json({ status : false , messgae : "Email Id doesn't Exists!!!"})
    }
    const isPasswordValid = await bcrypt.compare(password , user.password);
    if(!isPasswordValid){
        return res.json({ status : false , message : "Email ID or Password Incorrect"});
    }

    const token = jwt.sign({id : user._id} , "secret");
    return res.json({ status : true , token , userID :user._id , userName : user.username});
});

//User posting for email of the receiver sharing Note
router.post('/users/' , async (req , res) => {
  const email = req.body.email;
  const user = await UserModel.findOne({email : email});
  if(user){
    //return res.json({userID : user._id});

    //creating a new token with the receiver userID
    const token = jwt.sign({id : user._id} , "sharing-note");
    return res.json({ token , userID :user._id});
  }else{
    return res.json({message: "No User exists with this Email"});
  }
});


//Verify the token of the cookie user
router.get('/users/tokenverify' , async(req , res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "sharing-note", (err) => {
      if (err) {
        //token is wrong
        // This user is not authorised
        return res.json({status : false , message : "Wrong token - 404 - Can't use the Cookie"});
      }
      //verification done and there is no error 
      // then we should allow the user to continue with their request
      return res.json({status : true , message : "Token Verified - Authorised to use the Cookie"});
    });
  } else {
    //IF not token send from the frontend
    //If no user login In
    return res.json({status : false , message : "No Token Received - 401"});
  }

})


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, "secret", (err) => {
        if (err) {
          return res.sendStatus(403);
          //token is wrong
          // This user is not authorised
        }
        //verification done and there is no error 
        // then we should allow the user to continue with their request
        next(); 
      });
    } else {
      //IF not token send from the frontend
      //If no user login In
      res.sendStatus(401);
    }
};



module.exports = { router , verifyToken};
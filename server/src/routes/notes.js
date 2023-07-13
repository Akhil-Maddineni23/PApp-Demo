const express = require('express');
const NotesModel = require('../models/Notes');
const UserModel  = require('../models/Users.js');
const { verifyToken } = require('./users');

const router = express.Router();


router.post("/" , verifyToken , async (req , res) => {
    const { name , password , userID } = req.body;

    const userOwner = userID
    const note = await NotesModel.findOne({userOwner : userID , name : name});
    if(!note){
        const newNote = new NotesModel({
            name , password , userOwner
        });
        const note = await newNote.save();

        //Save the NoteID under the User as well
        const user = await UserModel.findOne({ _id : userID});
        user.savedNotes.push(note._id);
        await UserModel.updateOne({ _id : userID } , user);
        
        return res.json({message : "Note Created Successfully !!"});
    }
    else{
        console.log("Notes already existed");
        
        //Update the Note
        note.password = password;
        await NotesModel.updateOne({ _id : note._id}, note);
        return res.json({message : "Note updated Successfully in Users !!"});
    }
});

router.get("/:userID" , async(req , res) => {
    const userID = req.params.userID;
    const notes = await NotesModel.find({userOwner : userID});
    return res.json(notes);
})

router.post("/:noteID" , async(req , res) => {
    const noteID = req.params.noteID;
    const newPassword  = req.body.password;

    //Updating the password
    const note = await NotesModel.findOne({ _id : noteID});
    note.password = newPassword
    await NotesModel.updateOne({ _id : noteID}, note);

    return res.json({message : "Password Updated successfully in the Note!!"});
})

router.delete("/:noteID" , async(req , res) => {
    const noteID = req.params.noteID;
    const note = await NotesModel.findByIdAndDelete({_id : noteID});
    
    //Also delete this note from the User as well
    const userID = note.userOwner;
    await UserModel.updateOne({ _id : userID } , { $pull : { savedNotes : noteID}} );

    return res.json({message : "Successfully deleted Note"});
})

//Note is shared - update isShared variable and return the note
router.get("/shared/:noteID" , async(req , res) => {
    const noteID = req.params.noteID;

    const note = await NotesModel.findOne({ _id : noteID});
    note.isShared = true;
    await NotesModel.updateOne({ _id : noteID}, note);

    return res.json({message : "Note Updated Sucessfully"});
})

/*
// Share this note to the User
router.post("/shared/:noteID" , async(req , res) => {
    const noteID = req.params.noteID;
    const note = await NotesModel.findOne({_id : noteID});
    
    const email  = req.body.email;
    //Check if there is any user with this Email ID:
    const user = await UserModel.findOne({email : email});
    if(user){
        // Now save this Note Id in the shared Notes
        await UserModel.updateOne({ _id : user._id } , { $push : { receivedNotes : noteID}} );
        return res.json({message : `Note Shared Successfully to ${email}`})
    }else{
        return res.json({message : `${email} - Doesn't Exists`});
    }
})

// All shared notes received by the user
router.get("/shared/:userID" , async(req , res) => {
    const userID = req.params.userID;
    const data = await UserModel.findOne({ _id : userID}).populate('receivedNotes');
    if(data){
        return res.json(data.receivedNotes);
    }
    return res.json({message : "Something Fishy !.."});
})
*/


module.exports = router;


import express from "express";
const router = express.Router();
import notesModel from '../models/Notes.mjs'
import jwt from 'jsonwebtoken'
import fetchUser from "../Middleware/fetchUser.mjs";
import { body, validationResult } from 'express-validator';

// route 1: will be used to fetch all the notes of the user 
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await notesModel.find({ user: req.user.id });
        res.send(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error!");
    }
})



router.post('/addnote', fetchUser, [
    body('title', 'Title length should be greater than 2').isLength({ min: 3 }),
    body('description', 'Description length should be greater than 4').isLength({ min: 5 })
]
    , async (req, res) => {
        const { title, description, tag } = req.body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });

        }
        try {


            let note = {
                user: req.user.id, title, description, tag
            }
            let createdNotes = await notesModel.create(note);
            res.send(createdNotes);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal server error!");
        }

    })




router.put('/editnote/:id', fetchUser,
    async (req, res) => {
        const { title, description, tag } = req.body
        const errors = validationResult(req);
        const newNote = {};

        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;
        const d = new Date();
        newNote.data = d.setDate(d.getDate()); 
        

        try {

            var note = await notesModel.findById(req.params.id);

            if (!note) {
                return res.status(404).send("No result found!")
            }

            if (note.user.toString() !== req.user.id) return res.send("Invalid Request!")

            note = await notesModel.findByIdAndUpdate(req.params.id, newNote);
            res.send(note);

        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal server error!");
        }

    })


router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        let note = await notesModel.findById(req.params.id);

        if (!note) {
            return res.status(400).send("Note not found!")
        }
        if (note.user.toString() !== req.user.id) {
            return res.send("Invalid Request")
        }

        note = await notesModel.findByIdAndDelete(req.params.id);
        res.send("Note successfully deleted!")
    } catch (error) {
        console.log(err);
        res.status(500).send("Internal server error!")

    }
})
export default router;
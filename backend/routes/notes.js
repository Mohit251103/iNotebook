const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const Note = require('../models/Notes')

//get all the notes using:GET /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Note.find({ user: req.user.id })
    res.json(notes)

})

//add notes using : POST /api/notes/addnotes

router.post('/addnotes', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 5 }),
    body('description', 'Enter a valid description').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);

    try {
        const { title, description, tag } = req.body
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const note = new Note({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save()

        res.json(savedNote)

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
})

//update notes using : POST /api/notes/updatenotes

router.put('/updatenotes/:id', fetchuser, async (req, res) => {

    try {
        const { title, description, tag } = req.body;
        //create a new note object
        const newNote = {}

        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        let note = await Note.findById(req.params.id)

        if (!note) { return res.status(404).send("Not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note);
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal server error");
    }

})

//delete note using : POST /api/notes/deletenotes:id

router.delete('/deletenotes/:id', fetchuser, async (req, res) => {

    try {
        //find the note to be deleted and delete it 
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("Not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({Success:"note has been deleted"});
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal server error");
    }

})

module.exports = router
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator')
const bcrypt = require("bcryptjs")
const config = require("config");
const auth = require('../../middleware/authD');
const Conversation = require("../../models/Conversation");
const Client = require("../../models/Client");
const Dietician = require("../../models/Dietician");
const Post = require("../../models/Post");

router.get("/", async (req,res)=> {
    try {
        const posts = await Post.find({});
        res.json(posts);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
});

router.post("/", [auth, [
    check('text', 'Text is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty()

    ]
], async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const newPost = new Post ({
            text: req.body.text,
            title: req.body.title
        });
        postSaved = await newPost.save();
        res.json(postSaved);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
})

module.exports = router;
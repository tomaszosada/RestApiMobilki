const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator')
const bcrypt = require("bcryptjs")
const config = require("config");
const auth = require('../../middleware/authC');
const Conversation = require("../../models/Conversation");
const Client = require("../../models/Client");
const Dietician = require("../../models/Dietician");

router.get("/", auth, async (req,res)=> {
    try {
        const conversations = await Conversation.find({client: req.client.id}).populate('client', ['firstName', 'lastName']).populate( 'dietician', ['firstName', 'lastName']);
        res.json(conversations);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
});
//create new conv
router.post("/", [auth, [
    check('dietician', 'dietician is required').not().isEmpty(),
    ]
], async (req,res)=> {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }
        const newConversation = new Conversation ({
            dietician: req.body.dietician,
            client: req.client.id
        });
        convSaved = await newConversation.save();
        res.json(convSaved);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
})
//post new message
router.post("/dietician/:dieticianId", [auth, [
    check('text', 'text is required').not().isEmpty(),
    ]
], async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const newMessage = {
            text: req.body.text,
            sender: "c"
        };
        const conversation = await Conversation.findOne({client: req.client.id, dietician: req.params.dieticianId});
        conversation.messages.push(newMessage);
        savedConversation = await conversation.save();
        res.json(savedConversation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }



});
//Get message from specific conversation
router.get("/:conversationId", auth, async (req,res)=> {
    try {
        const conversations = await Conversation.findById(req.params.conversationId).populate('client', ['firstName', 'lastName']).populate( 'dietician', ['firstName', 'lastName']);
        res.json(conversations);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
});
module.exports = router;
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator')
const bcrypt = require("bcryptjs")
const config = require("config");
// @route   POST api/client
// @desc    Register client
// @access  Public
const Client = require('../../models/Client')
router.post("/", [
    check('firstName', 'First name is required!').not().isEmpty(),
    check('lastName', 'Last name is required!').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Plese enter a password with at least 6 characters').isLength({ min: 6}),
    check('pesel', 'Plese enter a valid Pesel').isLength({ min: 11, max:11})
], async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const { firstName, lastName, email, password, pesel } = req.body;
    try {
        let client = await Client.findOne({email});

        if(client){
           return res.status(400).json({errors: [{msg: 'Client already exists'}]});
        }


        client = new Client({
            firstName, lastName,  email, password, pesel
        })


        const salt = await bcrypt.genSalt(10);

        client.password = await bcrypt.hash(password, salt);

        await client.save();

        const payload = {
            client: {
                id: client.id
            }
        }
        jwt.sign(payload, 
            config.get("jwtSecret"),
             {expiresIn: 360000}, 
             (err, token) => {
            if(err) throw err;
            res.json({token});
        });
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server error');

        
    }
    }
);

router.get('/', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
})

router.get('/:client_id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.client_id);
        res.json(client);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
})
module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authD")
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator')
const config = require("config");
const bcrypt = require("bcryptjs");

const Dietician = require('../../models/Dietician');

// @route   GET api/dieticianAuth
// @desc    
// @access  Public      
router.get("/", auth, async (req,res)=> {
    try {
        const dietician = await Dietician.findById(req.dietician.id).select('-password');
        res.json(dietician);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/dieticianAuth
// @desc    Authenticate dietician and get token
// @access  Public
router.post("/", [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body;
    try {
        let dietician = await Dietician.findOne({email});

        if(!dietician){
           return res.status(400).json({errors: [{msg: 'Invalid!'}]});
        }

        const isMatch = await bcrypt.compare(password, dietician.password);

        if(!isMatch){
            return res.status(400).json({errors: [{msg: 'Invalid!'}]});
        }
        const payload = {
            dietician: {
                id: dietician.id
            }
        }
        jwt.sign(
            payload, 
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


module.exports = router;
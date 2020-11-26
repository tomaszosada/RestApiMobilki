const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator')
const bcrypt = require("bcryptjs")
const config = require("config");
// @route   POST api/dietician
// @desc    Register dietician
// @access  Public
const Dietician = require('../../models/Dietician')
router.post("/", [
    check('firstName', 'First name is required!').not().isEmpty(),
    check('lastName', 'Last name is required!').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Plese enter a password with at least 6 characters').isLength({ min: 6})
], async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const { firstName, lastName, email, password } = req.body;
    try {
        let dietician = await Dietician.findOne({email});

        if(dietician){
           return res.status(400).json({errors: [{msg: 'Dietician already exists'}]});
        }


        dietician = new Dietician({
            firstName, lastName,  email, password
        })


        const salt = await bcrypt.genSalt(10);

        dietician.password = await bcrypt.hash(password, salt);

        await dietician.save();

        const payload = {
            dietician: {
                id: dietician.id
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
        const dietician = await Dietician.find();
        res.json(dietician);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
})

router.get('/:dietetician_id', async (req, res) => {
    try {
        const dietician = await Dietician.findById(req.params.dietetician_id);
        res.json(dietician);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
})

module.exports = router;
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator')
const bcrypt = require("bcryptjs")
const config = require("config");
const auth = require('../../middleware/authC');
const Appointment = require("../../models/Appointment");
const Client = require("../../models/Client");
const Dietician = require("../../models/Dietician");

router.get("/", auth, async (req,res)=> {
    try {
        const appointments = await Appointment.find({client: req.client.id}).populate('client', ['firstName', 'lastName']).populate( 'dietician', ['firstName', 'lastName']);
        res.json(appointments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
});

router.post("/", [auth, [
    check('dietician', 'dietician is required').not().isEmpty(),
    check('date', 'Date datatype is required!').isDate()
    ]
], async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const newAppointment = new Appointment ({
            dietician: req.body.dietician,
            client: req.client.id,
            text: req.body.text,
            date: req.body.date
        });
        appointmentSaved = await newAppointment.save();
        res.json(appointmentSaved); 

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
})


module.exports = router;
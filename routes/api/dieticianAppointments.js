const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator')
const bcrypt = require("bcryptjs")
const config = require("config");
const auth = require('../../middleware/authD');
const Appointment = require("../../models/Appointment");


//Get dietician appointments
router.get("/", auth, async (req,res)=> {
    try {
        const appointments = await Appointment.find({dietician: req.dietician.id}).populate('client', ['firstName', 'lastName']).populate( 'dietician', ['firstName', 'lastName']);
        res.json(appointments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
});

//Confirm appointment
router.put("/confirm/:appointmentId", auth, async (req,res)=> {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.appointmentId, {confirmed: true});
        res.send(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
});

//Delete an appointment
router.delete("/:appointmentId", auth, async (req,res)=>{
    try {
        await Appointment.findByIdAndDelete(req.params.appointmentId);
        res.json({"msg": "Appointment deleted"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
        
    };
})
module.exports = router;
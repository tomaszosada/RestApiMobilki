const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'client'
    },
    dietician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'dietician'
    },
    text: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false 
    }
  });

  module.exports = mongoose.model("appointment", appointmentSchema)
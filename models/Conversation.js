const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'client'
    },
    dietician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'dietician'
    },
    messages: [{
      text: {
          type: String,
          require: true
      },
      sender: {
          type: String,
          require: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }]
  });

  module.exports = mongoose.model("conversation", conversationSchema)
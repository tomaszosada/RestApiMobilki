const express = require("express");
const connectDB = require("./config/db");

const app = express();
//connect to database
connectDB();

//INIT middleware

app.use(express.json({extended: false}));

app.get("/", function(req,res){
    res.send("OK");
})

// Define routes
app.use('/api/clientauth', require('./routes/api/clientAuth'));
app.use('/api/dieticianauth', require('./routes/api/dieticianAuth'));

 app.use('/api/clients', require('./routes/api/clients'));
 app.use('/api/dieticians', require('./routes/api/dieticians'));
 app.use('/api/client/converations', require('./routes/api/clientConversations'));
 app.use('/api/dietician/converations', require('./routes/api/dieticianConversations'));
app.use('/api/client/appointments', require("./routes/api/clientAppointments"));
app.use('/api/dietician/appointments', require("./routes/api/dieticianAppointments"));
app.use("/api/posts", require("./routes/api/post"));

// app.use('/api/auth', require('./routes/api/auth'));
// app.use('/api/profile', require('./routes/api/profile'));
// app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));
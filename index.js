const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require('./routes/user-routes');
const adminRouter = require('./routes/adminRoutes');
const movieRouter = require('./routes/movieRoutes');
const bookingRouter = require('./routes/bookingRoutes')
dotenv.config();
const app= express()
app.use(cors());
//middleware
app.use(express.json())

app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/movie",movieRouter);
app.use("/bookings",bookingRouter);



mongoose.connect(`mongodb+srv://hanaouerghi30:${process.env.MONGODB_PASSWORD}@cluster0.tcw9ccq.mongodb.net/?retryWrites=true&w=majority`).then(()=>
app.listen(5000,()=>
    console.log(`connected to port ${5000} and server is running`)
)).catch((err)=>console.log(err))





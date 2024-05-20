require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8001;

connectDB()

app.use(cors(corsOptions));

app.use(express.urlencoded( {extended: true} ));

app.use(express.json());

app.use(cookieParser());




app.use('/users', require('./routes/usersRoutes'));
app.use('/notes', require('./routes/noteRoutes'));

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`server running on port ${PORT}`))
})

mongoose.connection.on('error', error => {
    console.log(error)
});

require('dotenv').config();
require('./config/database')
const express = require('express');
const PORT = process.env.PORT || 3412;
const app = express();
const cors = require('cors');
const userRouter = require('./routes/user');


app.use(express.json());
app.use(cors());
app.use('api/v1', userRouter);



app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`)
});
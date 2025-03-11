require('dotenv').config();
require('./config/database')
const express = require('express');
const PORT = process.env.PORT || 3412;
const app = express();


app.use(express.json());



app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`)
});
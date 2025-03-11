require('dotenv').config();
require('./config/database')
const express = require('express');
const PORT = process.env.PORT || 3412;
const app = express();
const cors = require('cors');


app.use(express.json());
app.use(cors());



app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`)
});
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {default:axios}= require('axios');
const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 3030;

server.listen(PORT, ()=>{
    console.log(`Listening to PORT ${PORT} O.o`);
})
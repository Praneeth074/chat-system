require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors')
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});
require("./socket programming/socket")(io);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT;

const authRouter = require('./auth/auth-router')
const userRouter = require('./api/users-router')
app.use('/auth',authRouter)
app.use('/api',userRouter)

server.listen(port, () => {
    console.log(`Server running on ${port}`);
});

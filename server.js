require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(morgan("dev"));

const httpServer = app.listen(process.env.PORT || 8000, () =>
    console.log("Server connected")
);

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "https://multiplayer-tic-tac-toe-mern.netlify.app/",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    // console.log("Client connnected", socket.id);
    socket.on("turn-switch", (data) => {
        const room = JSON.parse(data).room;
        io.to(room).emit("opponent-move", data);
    });

    socket.on("create", (room) => {
        socket.join(room);
    });

    socket.on("join", (room) => {
        socket.join(room);
        io.to(room).emit("game-start");
    });

    socket.on("restart", (data) => {
        const room = JSON.parse(data).room;
        io.to(room).emit("restart");
    });
});

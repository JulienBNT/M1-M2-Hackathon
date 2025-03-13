require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const repostRoute = require("./routes/repostRoute");
const bookmarkRoute = require("./routes/bookmarkRoute");
const likeRoute = require("./routes/likeRoute");
const commentRoute = require("./routes/commentRoute");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/whispr", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connecté..."))
  .catch((err) => console.error("Erreur de connexion MongoDB:", err));

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoute);
app.use("/posts", postRoute);
app.use("/reposts", repostRoute);
app.use("/bookmarks", bookmarkRoute);
app.use("/likes", likeRoute);
app.use("/comments", commentRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Une erreur s'est produite !" });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("register", (userId) => {
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
    socket.data.userId = userId;
    socket.join(`user:${userId}`);
  });

  socket.on("disconnect", () => {
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

app.set("socketio", io);
module.exports = io;

server.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur ${process.env.MONGODB_URI}`);
});

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

app.use(cors(
  {
    origin: "http://localhost:5173",
  }
))
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

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://127.0.0.1:${port}`);
});

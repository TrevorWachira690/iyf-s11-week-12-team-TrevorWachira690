// SHARED FILE - used by everyone
// See: docs/TEAM_DIVISION.md
//
// The main backend file that starts the server and connects
// everything together. The group leader reviews changes to this file.

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const config = require("./config");

const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Community Hub API" });
});

mongoose.connect(config.mongodbUrl)
.then(() => {
    console.log("Connected to MongoDB");

    app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    });
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
});

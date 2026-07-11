const express = require("express");

const movieRoutes = require("./routes/movieRoutes");

const app = express();

app.use(express.json());
app.use("/api/movies", movieRoutes);



app.get("/", (req, res) => {
    res.send("OTT Backend is running!");
});


module.exports = app;
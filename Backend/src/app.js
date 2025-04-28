
const express = require('express');
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(cors());

const groupRoutes = require("./routes/groups.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/api/groups", groupRoutes)
app.use("/api/auth", authRoutes)


module.exports = app;
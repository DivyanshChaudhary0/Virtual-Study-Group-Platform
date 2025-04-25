
const express = require('express');
const cors = require("cors");

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

const groupRoutes = require("./routes/groups.routes")

app.use("/api/groups", groupRoutes)

module.exports = app;
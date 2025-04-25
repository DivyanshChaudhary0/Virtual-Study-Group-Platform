
const express = require('express');

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const groupRoutes = require("./routes/groups.routes")

app.use("/api/groups", groupRoutes)

module.exports = app;

const express = require('express');
const cors = require("cors");
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(cors());

const groupRoutes = require("./routes/groups.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/api/groups", groupRoutes)
app.use("/api/auth", authRoutes)

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


module.exports = app;
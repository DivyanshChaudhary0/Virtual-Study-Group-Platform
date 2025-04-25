
const mongoose = require("mongoose");
const config = require("../config/config");

mongoose.connect(config.MONGO_URI)
.then(() => {
    console.log("Db connected");
})
.catch(() => {
    console.log("Db not connected");
})

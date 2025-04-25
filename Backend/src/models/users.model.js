
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        unique: [true, "name is already taken"],
        minLength: 5,
        maxLength: 50
    },
    email: {
        type: String,
        maxLength: 20,
        default: ""
    },
    phone: {
        type: Number,
        maxLength: 12,
        minLength: 10,
        default: ""
    },

    address: {
        type: String,
        maxLength: 100,
        default: ""
    },

    profile: {
        type: String,
        default: ""
    }

},{ timestamps: true})

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

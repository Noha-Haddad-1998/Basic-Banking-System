
const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/BasicBankingSystem").then(() => {
    console.log("mongodb connected");

}).catch(err => {
    console.log("failed to connect", err);
})

const Customers = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    balance: {
        type: Number,
        require: true
    }
})

const collection = new mongoose.model("Collections", Customers)
module.exports = collection
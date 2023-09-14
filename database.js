const mongoose = require("mongoose");

class Database{

    constructor(){
        this.connect();
    }

    connect(){
        mongoose.connect("mongodb+srv://adarsh:12345678%40123@twitterclone.otpgnno.mongodb.net/?retryWrites=true&w=majority")
        .then(() => {
            console.log("Database Connection Successful");
        })
        .catch((err) => {
            console.log("Database Connection Error!" + err);
        })
    }
}

module.exports = new Database();
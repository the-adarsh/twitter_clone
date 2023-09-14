const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");


app.engine('pug',require('pug').__express);
app.set('views', 'views');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));

router.get("/", (req, res, next) => {
    res.status(200).render('register');
})

router.post("/", async (req, res, next) => {

    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;

    var payload = req.body;

    if(firstName && lastName && username && email && password){
        var user = await User.findOne({
            $or:[
                {username: username},
                {email: email}
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something Went Wrong :(";
            res.status(200).render('register', payload);
        });

        if(user == null){
            
            var data = req.body;
            
            data.password = await bcrypt.hash(password,10);
            
            User.create(data)
            .then((user) => {
                req.session.user = user;
                return res.redirect("/")
            })
        }
        else {
            if(email == user.email){
                payload.errorMessage = "Email Already In Use";
            }
            else {
                payload.errorMessage = "Username Already In Use";
            }
            res.status(200).render('register', payload);
        }
    }
    else {
        payload.errorMessage = "Fields Can't be Empty, Enter Some Value";
        res.status(200).render('register', payload);
    }
})

module.exports = router;
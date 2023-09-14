const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");
const bcrypt = require("bcrypt");

app.engine('pug',require('pug').__express);
app.set('views', 'views');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));

router.get("/", (req, res, next) => {
    res.status(200).render('login');
})

router.post("/", async (req, res, next) => {

    var payload = req.body;

    if(req.body.logUsername && req.body.logPassword){

        var user = await User.findOne({
            $or:[
                {username: req.body.logUsername},
                {email: req.body.logUsername}
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something Went Wrong :(";
            res.status(200).render('login', payload);
        });

        if(user != null){
            var result = await bcrypt.compare(req.body.logPassword, user.password);

            if(result === true){
                req.session.user = user;
                return res.redirect("/");
            }    
        }
        payload.errorMessage = "Login Credentials Incorrect !";
        return res.status(200).render('login', payload);
    }

    payload.errorMessage = "Make Sure You Enter Valid Credentials :)";
    res.status(200).render('login');
})

module.exports = router;
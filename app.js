const express = require('express');
const app = express();
const port = 3000;
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const mongoose = require("./database");
const session = require("express-session");



const server = app.listen(port, () => {console.log("listening on port " + port)});


app.engine('pug',require('pug').__express);
app.set('views', 'views');
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: "blue banana",
    resave: true,
    saveUninitialized: false
}))

//routes
const loginRoutes = require('./routes/loginR');
const registerRoutes = require('./routes/registerR');
const logoutRoutes = require('./routes/logout');

//api routes
const postsApiRoutes = require('./routes/api/posts');

app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/logout', logoutRoutes);

app.use('/api/posts', postsApiRoutes);

app.get("/", middleware.requirelogin, (req, res, next) => {

    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    }

    res.status(200).render('home',payload);
}) 
const ejs = require('ejs');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

let secretDB = async () => {
    await mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to DB");
}
secretDB();

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secretSchema = new mongoose.Schema({
    secret: String
});

const User = new mongoose.model("User", userSchema);
const Secret = new mongoose.model("Secret", secretSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {

    bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save();
        res.render("secrets");
    });

});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existUser = await User.findOne({ email: username });
    if (existUser) {
        bcrypt.compare(password, existUser.password).then(function (result) {
            if (result === true) {
                res.render("secrets");
            } else {
                console.log("Password not matched");
                res.redirect("/login");
            }
        });

    } else {
        console.log("User not found");
        res.redirect("/register");
    }
});

app.post("/submit", async (req, res) => {

    const newSecret = new Secret({
        secret: req.body.secret
    });
    await newSecret.save();
    res.redirect("/secrets");
});

app.get("/secrets", async (req, res) => {
    const allSecrets = await Secret.find({});
    res.render("secrets", { secrets: allSecrets });
});


app.get("/logout", (req, res) => {
    res.redirect("/");
});
app.get("/submit", (req, res) => {
    res.render("submit");
});


app.listen(80, function () {
    console.log("Server started on port 80");
});
const ejs = require('ejs');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
require('dotenv').config();
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

let secretDB = () => {
    mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to DB");
}
secretDB();

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secrets: [{ type: String }]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// const secretSchema = new mongoose.Schema({
//     secret: String
// });

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser( User.deserializeUser());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    function (accessToken, refreshToken, profile, cb) {
        // console.log(profile)
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

// const Secret = new mongoose.model("Secret", secretSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/secrets');
    });

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/secrets", async (req, res) => {

    if (req.isAuthenticated()) {

        //This is for finding all the secrets from all users
        // const findSecret =await User.find({ "secret": { $ne: null } }).select("secrets");

        //This is for finding all the secrets from the current user
        const findSecret = await User.findOne({ _id: req.user._id }).select("secrets");

        const secretArray = findSecret.secrets;
        // console.log(findSecret)

        if (findSecret) {
            res.render("secrets", { secretArray });
        } else {
            res.redirect("/submit");
        }
    } else {
        res.redirect("/login");
    }

});
app.get("/submit", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("submit");

    } else {
        res.redirect("/login");
    }
});
app.get("/delete/:secret", async (req, res) => {
    const secretToDelete = req.params.secret;
    const findSecret = await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { secrets: secretToDelete } });
    await findSecret.save();
    res.redirect("/secrets");
});

app.post("/submit", async (req, res) => {
    try {
        const submittedSecret = req.body.secret;
        const user = await User.findById(req.user._id)
        user.secrets.push(submittedSecret);
        await user.save();
        res.redirect("/secrets");
    } catch (err) {
        console.log(err);
    }
});


app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.post("/register", (req, res) => {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err, "register error");
            res.redirect("/register");

        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });

});

app.post("/login", (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err, "login error");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
});


// app.post("/register", (req, res) => {

//     bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
//         const newUser = new User({
//             email: req.body.username,
//             password: hash
//         });
//         newUser.save();
//         res.render("secrets");
//     });

// });

// app.post("/login", async (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     const existUser = await User.findOne({ email: username });
//     if (existUser) {
//         bcrypt.compare(password, existUser.password).then(function (result) {
//             if (result === true) {
//                 res.render("secrets");
//             } else {
//                 console.log("Password not matched");
//                 res.redirect("/login");
//             }
//         });

//     } else {
//         console.log("User not found");
//         res.redirect("/register");
//     }
// });

// app.get("/secrets", async (req, res) => {
//     const secrets = await Secret.find({});
//     console.log(secrets)
//     res.render("secrets", { secrets: secrets });
// });

// app.post("/submit", async (req, res) => {
//     const newSecret = new Secret({
//         secret: req.body.secret
//     });
//     await newSecret.save();
//     res.redirect("/secrets");
// });



// app.get("/logout", (req, res) => {
//     res.redirect("/");
// app.get("/submit", (req, res) => {
//     res.render("submit");
// });


app.listen(80, function () {
    console.log("Server started on port 80");
});
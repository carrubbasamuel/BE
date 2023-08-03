const passport = require("passport");
const jwt = require("jsonwebtoken");
const SchemaUser = require("../models/SchemaUser.js");
const session = require("express-session");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const express = require("express");
const google = express();



google.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));



google.use(passport.initialize());
google.use(passport.session());


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRE,
    callbackURL: "http://localhost:3003/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
}
);

passport.deserializeUser((user, done) => {
    done(null, user);
}
);


google.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));

google.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async function (req, res) {
        try {
            let googleUser = await SchemaUser.findOne({ email: req.user.emails[0].value });

            if (!googleUser) {
                googleUser = new SchemaUser({
                    name: req.user.name.givenName,
                    surname: req.user.name.familyName,
                    email: req.user.emails[0].value,
                    avatar: req.user.photos[0].value,
                });
                await googleUser.save();
            }

            const token = jwt.sign({
                userId: googleUser._id,
                name: googleUser.name,
                surname: googleUser.surname,
                email: googleUser.email,
                avatar: googleUser.avatar
            }, process.env.KEY_JWT, { expiresIn: '1h' });

            // Reindirizza con il token nella query string
            res.redirect(`http://localhost:3000/success?token=${token}`);
        }
        catch (error) {
            console.log(error);
            res.redirect(`http://localhost:3000/error?message=${error.message}`);
        }
    });



module.exports = google;





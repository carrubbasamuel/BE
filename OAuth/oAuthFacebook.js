const passport = require("passport");
const jwt = require("jsonwebtoken");
const SchemaUser = require("../models/SchemaUser.js");
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require("express-session");

const express = require("express");
const facebook = express();

facebook.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));



facebook.use(passport.initialize());
facebook.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
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

facebook.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

facebook.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    async function (req, res) {
        try {
            let facebookUser = await SchemaUser.findOne({ email: req.user.emails[0].value });

            if (!facebookUser) {
                facebookUser = new SchemaUser({
                    name: req.user.name.givenName,
                    surname: req.user.name.familyName,
                    email: req.user.emails[0].value,
                    avatar: req.user.photos[0].value,
                });
                await facebookUser.save();
            }

            const token = jwt.sign({
                userId: facebookUser._id,
                name: facebookUser.name,
                surname: facebookUser.surname,
                email: facebookUser.email,
                avatar: facebookUser.avatar
            }, process.env.KEY_JWT, { expiresIn: '1h' });

            // Reindirizza con il token nella query string
            res.redirect(`http://localhost:3000/success?token=${token}`);
            console.log(req.user);
        }
        catch (error) {
            console.log(error);
            res.redirect(`http://localhost:3000/error?message=${error.message}`);
        }
    });

module.exports = facebook;

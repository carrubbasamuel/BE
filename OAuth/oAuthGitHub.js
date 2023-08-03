
const passport = require("passport");
const jwt = require("jsonwebtoken");
const SchemaUser = require("../models/SchemaUser.js");
const GitHubStrategy = require('passport-github2').Strategy;
const session = require("express-session");

const express = require("express");
const github = express();

github.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

github.use(passport.initialize());
github.use(passport.session());


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
},
    function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        return done(null, profile);
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

github.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })),
    (req, res) => {
        console.log(req.user);
    }


github.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('http://localhost:3000/login');
    });




module.exports = github;
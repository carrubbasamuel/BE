
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
    callbackURL: process.env.URI + "/auth/github/callback",
    scope: ['user:email'],
},
    function (accessToken, refreshToken, profile, done) {
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

github.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: process.env.URI_REDIRECT + '/login' }),
    async function (req, res) {
        try {
            let githubUser = await SchemaUser.findOne({ email: req.user.emails[0].value });
            if (!githubUser) {
                githubUser = new SchemaUser({
                    name: req.user.displayName.split(" ")[0],
                    surname: req.user.displayName.split(" ")[1],
                    email: req.user.emails[0].value,
                    provider: "github",
                    avatar: req.user._json.avatar_url,
                });
                await githubUser.save();
            }

                const token = jwt.sign({
                    userId: githubUser._id,
                    name: githubUser.name,
                    surname: githubUser.surname,
                    email: githubUser.email,
                    avatar: githubUser.avatar
                }, process.env.KEY_JWT, { expiresIn: '1h' });

                res.redirect(`${process.env.URI_REDIRECT}/success?token=${token}`);
            
        } catch (error) {
            console.error(error);
            res.redirect(process.env.URI_REDIRECT + '/login');
        }
    }
);


module.exports = github;
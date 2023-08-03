const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");



require("dotenv").config();

const app = express();
app.use(cors());


// middleware
app.use(express.json());
const { verifyToken } = require("./middleware/midJWT.js");



// connessione al DB
mongoose.connect(process.env.MONGO_KEY);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connessione al DB avvenuta con successo!"));

//OAuth
const google = require("./OAuth/oAuthGoogle.js");
const facebook = require("./OAuth/oAuthFacebook.js");
const github = require("./OAuth/oAuthGitHub.js");

app.use("/", google);// google login
app.use("/", facebook);// facebook login
app.use("/", github);// github login



//routes
const Post = require("./routes/routePost.js");
const User = require("./routes/routeUser.js");
const Resource = require("./routes/routeResources.js");
const Review = require("./routes/routeReview.js");


app.use("/", User);
app.use("/", Resource);
app.use("/", verifyToken, Review);
app.use("/", verifyToken, Post);



//avvio del server
app.listen(3003, () => console.log("Server avviato con successo!"));


  
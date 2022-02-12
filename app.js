//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Transport123@987$%^&.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/ddDB", {useNewUrlParser: true});

const dealerSchema = new mongoose.Schema ({
  username: String,
  mobile: String,
  nature: String,
  weight: String,
  quantity: String,
  city: String,
  state: String,
  age: String,
  truckNumber: String,
  truckCapacity: String,
  transporterName: String,
  drivingExp: String,
  from1: String,
  to1: String,
  from2: String,
  to2: String,
  from3: String,
  to3: String,
  email: String,
  password: String,
});

dealerSchema.plugin(passportLocalMongoose);

const Dealer = new mongoose.model("Dealer", dealerSchema);

passport.use(Dealer.createStrategy());

passport.serializeUser(Dealer.serializeUser());
passport.deserializeUser(Dealer.deserializeUser());

app.get("/", function(req, res){
  res.render("home");
});


app.get("/dealer", function(req,res){
  res.render("dealer");
});

app.get("/driver", function(req,res){
  res.render("driver");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/dashboard", function(req, res){
  Dealer.find({"name":{$ne: null}}, function(err, founduser){
  if(err){
    console.log(err);
  }else{
    res.render("dashboard");
  }
});
});


// app.get("/submit", function(req, res){
//   if (req.isAuthenticated()){
//     res.render("submit");
//   } else {
//     res.redirect("/login");
//   }
// });

// app.post("/submit", function(req,res){
//   const submittedsecret = req.body.secret;
//
//   User.findById(req.user.id, function(err, founduser){
//
//     if(err){
//       console.log(err);
//     }else{
//       if(founduser){
//         founduser.secret = submittedsecret;
//         founduser.save(function(){
//           res.redirect("/secrets");
//         });
//       }
//     }
//   });
// });

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});


app.post("/register", function(req, res){
  Dealer.register({username: req.body.username, mobile: req.body.number, nature: req.body.nature, weight: req.body.weight, quantity: req.body.quantity, city: req.body.city, state: req.body.state, email: req.body.email}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/dashboard");
      });
    }
  });
});

app.post("/login", function(req, res){

  const dealer = new Dealer({
    username: req.body.username,
    password: req.body.password
  });

  req.login(dealer, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/dashboard");
      });
    }
  });

});







app.listen(3000, function() {
  console.log("Server started on port 3000.");
});

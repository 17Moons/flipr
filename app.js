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

const ddSchema = new mongoose.Schema ({
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

ddSchema.plugin(passportLocalMongoose);

const DD = new mongoose.model("DD", ddSchema);

passport.use(DD.createStrategy());

passport.serializeUser(DD.serializeUser());
passport.deserializeUser(DD.deserializeUser());

app.get("/", function(req, res){
  res.render("home");
});


app.get("/dealer", function(req,res){
  res.render("dealer");
});

app.get("/driver", function(req,res){
  res.render("driver");
});

app.get("/dealer-login", function(req, res){
  res.render("dealer_login");
});

app.get("/dealer-register", function(req, res){
  res.render("dealer_register");
});

app.get("/dealer-dashboard", function(req, res){
  DD.find({"name":{$ne: null}}, function(err, founduser){
  if(err){
    console.log(err);
  }else{
    res.render("dealer_dashboard");
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


app.post("/dealer-register", function(req, res){
  DD.register({username: req.body.username, mobile: req.body.number, nature: req.body.nature, weight: req.body.weight, quantity: req.body.quantity, city: req.body.city, state: req.body.state, email: req.body.email}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/dealer-register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/dealer-dashboard");
      });
    }
  });
});

app.post("/dealer-login", function(req, res){

  const dd = new DD({
    username: req.body.username,
    password: req.body.password
  });

  req.login(dd, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/dealer-dashboard");
      });
    }
  });

});







app.listen(3000, function() {
  console.log("Server started on port 3000.");
});

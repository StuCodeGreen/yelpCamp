var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");

//root route
router.get("/",function(req,res){
    res.render("landing");
});

//show register form route
router.get("/register",function(req,res){
    res.render("register");
});

//signup route
router.post("/register",function(req,res){
  
   var newUser = new User({username: req.body.username});
   User.register(newUser,req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("/register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Wellcome to YelpCamp " + user.username);
           res.redirect("/campgrounds");
       });
   });
});

//show login form
router.get("/login", function(req,res){
    res.render("login");
});

// hangling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
        
    }), function(req,res){
        
    });

// logout route

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success", "You have loged out")
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res, next){
    if(req.isAuthenticated()){
        return next();
        
    }
    req.flash("error", "Please log in")
    res.redirect("/login");
} 

module.exports = router;
//All middleware goes here
var middlewareObj = {},
    Campground    = require("../models/campgrounds"),
    Comment       = require("../models/comments");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //is  user logged in?
    if(req.isAuthenticated()){
     Campground.findById(req.params.id,function(err,foundCamp){
        if(err || !foundCamp){
        console.log(err);
        req.flash("error","Campground not found")
        return res.redirect("back");
    }
         else {
             if (!foundCamp) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
              //does the user own camp ground ?
              if(foundCamp.author.id.equals(req.user._id)){
                next();  
              } else {
                req.flash("error", "You have no permission");
                res.redirect("back");
              }
        } 
    });
    } else {
            req.flash("error", "Please log in");
            res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
 //is  user logged in?
if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err || !foundComment){
        console.log(err);
        req.flash("error","Comment1 not found")
        return res.redirect("back");
    
        } else {
             
              //does the user own the comment?
              if(foundComment.author.id.equals(req.user._id)){
                next();  
              } else {
                req.flash("error", "You have no permission");
                res.redirect("back");
              }
            } 
        });
    }else {
        req.flash("error", "Please log in");
        res.redirect("/login");
    }
}


middlewareObj.isLoggedIn = function(req,res, next){
    if(req.isAuthenticated()){
        return next();
        
    }
    req.flash("error", "Please log in ")
    res.redirect("/login");
} 


module.exports = middlewareObj
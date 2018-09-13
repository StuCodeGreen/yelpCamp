var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campgrounds"),
    middleware  = require("../middleware"),
    Comment     = require("../models/comments");
    
//comments new

router.get("/new",middleware.isLoggedIn,function(req,res){
    
// find campgorund by id

Campground.findById(req.params.id, function(err,campground){
  if(err || !campground){
        console.log(err);
        req.flash("error","Not found")
        return res.redirect("/campgrounds");
    }else{
       res.render("comments/new",{campgrounds:campground});
       
    }
});
    
});

//comment create

router.post("/",middleware.isLoggedIn, function(req,res){
    // lookup campground using id
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
           // create new comment 
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error", "Something went wrong")
               } else {
                //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                // connect new comment to campground
                   campground.comments.push(comment);
                   campground.save();
                // redirect to campground show page
                // show flash message
                    req.flash("success", "You have added new comment")
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
        }
    });
});

//comment edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id, function(err,foundCamp){
        if(err || !foundCamp){
        req.flash("error","Camp not found");
       return res.redirect("back")
        }
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
            }
        });
    });
    
  
    
});

//comment update route
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err,updatedComment){
        if(err){
            res.redirect("back");
            
        } else {
            req.flash("success", "Comment edited");
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//comment destory route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})






module.exports = router;
var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campgrounds"),
    middleware  = require("../middleware");
//index route
router.get("/", function(req,res){
    console.log(req.user);
    //get all campgrounds from db
    Campground.find({},function(err,allcamps){
        if(err){
            console.log(err);
        }
        else{
         
            res.render("campground/index", {campgrounds:allcamps});
        }
        
    });
   
});

//create - add new campground to db
router.post("/", middleware.isLoggedIn,function(req,res){
    // res.send("You hit the post route");
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = {name: name, image: image, description: desc, author:author, price: price};
     // create new campground and save to DB
     Campground.create(newCamp, function(err,newCamp){
         if(err){
             console.log(err);
             
         }
         else {
             console.log("new camp was added to db");
             res.redirect("/campgrounds");
         }
     });
     
     
});

//new - show form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
    
    res.render("campground/new");
});

//show - shows more info about one campground
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
    if(err || !foundCamp){
        console.log(err);
        req.flash("error","Not found")
        return res.redirect("/campgrounds");
    }
    else{
        console.log(foundCamp);
        res.render("campground/show",{campgrounds:foundCamp});
    }
});
});

//edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
                console.log(err);
            } else {
                    res.render("campground/edit",{campground:foundCamp});  
                } 
        });
    });

//update campground route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find and update the correct campground
    
    Campground.findByIdAndUpdate(req.params.id,req.body.data,function(err,updatedCamp){
        if(err){
            console.log(err);
            
        } else {
            res.redirect("/campgrounds/"+req.params.id)
            // or you can use updatedCamp
        }
    })
    // redirect to show page
})

//destroy route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds")
        }
    })
})


module.exports = router; 



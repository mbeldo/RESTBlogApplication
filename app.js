var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");


//App Config
mongoose.connect("mongodb://localhost/restfulblogapp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));



//Mongoose Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: 
        {type: Date, 
        default: Date.now}
});

var Blog =mongoose.model("Blog", blogSchema);



//RESTFUL ROUTES

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(error,blogs){
        if(error){
            console.log(error);
        }
        else {
            res.render("index", {blogs:blogs});
        }
    });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
    
});

app.post("/blogs", function(req,res){
   //create blog
   
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog, function(error, newBlog){
       if(error){
           res.render("new");
       }
       else {
           console.log(req.body);
           res.redirect("/blogs");
       }
   });
   //redirect
});


//Show selected blogpost
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(error, foundBlog){
        if (error){
            res.redirect("/blogs/");
            
        }
        else {
            res.render("show", {blog:foundBlog});
        }
    });
});



//Edit
app.get("/blogs/:id/edit", function(req, res){
    
    Blog.findById(req.params.id, function(error, foundBlog){
        if(error){
            res.redirect("/blogs");
        }
        else
        {
            res.render("edit", {blog:foundBlog});
        }
    });
});
    



//update route
app.put("/blogs/:id", function(req,res){
       req.body.blog.body = req.sanitize(req.body.blog.body);
        Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error, updatedBlog){
        
             if (error)
                {
                res.redirect("/blogs");
                }
            else 
                {
                res.redirect("/blogs/" + req.params.id);
                }
    
    });
});


app.delete("/blogs/:id", function(req,res){
  Blog.findByIdAndRemove(req.params.id, function(error) {
            if(error)
              {
                  res.send("there was an error" + error);
              }
              else
              {
                  res.redirect("/blogs");
              }
  
  });
    
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});

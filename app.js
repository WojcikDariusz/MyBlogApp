var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var mongoose   = require("mongoose");
var express    = require("express");
var app        = express();

//app config
mongoose.connect("mongodb://localhost:27017/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongoose model config
var blogSchema = new mongoose.Schema({
    
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
    
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTful routes


app.get("/", function(req,res) {
   res.redirect("/blogs"); 
});

app.get("/blogs", function(req,res) {

    Blog.find({}, function(err,foundBlogs) {
        if(err) {
            console.log("There was an error");
        } else {
          res.render("index", {blog: foundBlogs});  
        }
    });
    
});

//NEW ROUTE

app.get("/blogs/new", function(rew,res) {
   res.render("new"); 
});

//CREATE Route

app.post("/blogs", function(req,res) {
    //sanitize
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err,parsed) {
       if(err) {
           console.log("error");
       } else {
           console.log(parsed);
           res.redirect("/blogs");
       }
    });

});



//SHOW ROUTE

app.get("/blogs/:id", function(req,res) {
   
    Blog.findById(req.params.id, function(err, foundPost) {
       if(err) {
           console.log(err);
       } else {
           res.render("show.ejs",{post: foundPost}); 
       }
   });

});
   
//EDIT ROUTE

app.get("/blogs/:id/edit", function(req,res) {
//   req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findById(req.params.id, function(err, foundPost) {
      if(err) {
          res.redirect("/blogs");
      } else {
         
          res.render("edit.ejs",{blog:foundPost}); 
      }
  })
});


//UPDATE ROUTE

app.put("/blogs/:id", function(req,res) {
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatePost) {
        if(err) {
            console.log("ERROR");
        } else {
            console.log(req.body.blog);
            res.redirect("/blogs/"+req.params.id);
        }
    });
    
});


//DESTROY ROUTE

app.delete("/blogs/:id/delete", function(req,res) {
   
   Blog.findByIdAndRemove(req.params.id, req.body.post, function(err,destroyedPost) {
        if(err) {
            console.log("ERROR");
        } else {
           res.redirect("/blogs/");
        }
    });
    
});



app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server is listening!"); 
});

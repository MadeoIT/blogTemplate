var express = require('express');
    app = express();
    bodyParser = require('body-parser');
    mongoose = require('mongoose');
    methodOverride = require('method-override');
    sanitizer = require('express-sanitizer');

mongoose.connect('mongodb://localhost/myblog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(sanitizer());

var blogSchema = new mongoose.Schema ({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

app.get('/', function(req, res) {
    res.redirect('/blogs');
});

app.get('/blogs', function(req, res) {
    Blog.find({}, function (err, blogposts) {
        if (err){
            console.log(err);
        } else {
            res.render('index', {blogposts: blogposts});
        }
    });
});
app.get('/blogs/new', function(req, res) {
    res.render('new');
});
app.post('/blogs', function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var newPost = req.body.blog;
    Blog.create(newPost, function (err, newPost) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/blogs');
        }
    });
});
app.get('/blogs/:id', function(req, res) {
    var id = req.params.id;
    Blog.findById(id, function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render('show', {foundPost: foundPost});
        }
    });
});
app.get('/blogs/:id/edit', function(req, res) {
    var id = req.params.id;
    Blog.findById(id, function (err ,foundPost) {
        if(err){
            console.log(err);
        } else {
            res.render('edit', {foundPost: foundPost});
        }
    })
});
app.put('/blogs/:id', function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
       if (err) {
           console.log(err);
       } else {
           res.redirect('/blogs/' + req.params.id);
       }
   })
});
app.delete('/blogs/:id', function(req, res) {
    var id = req.params.id;
    Blog.findByIdAndRemove(id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/blogs');
        }
    })
});

app.listen(3000, function() {
    console.log('App listening on port 3000!');
});
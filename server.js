var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server

var axios = require("axios");
var cheerio = require("cheerio");


// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/NYTscraper");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NYTscraper"

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI)
// routes

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000

// initialize express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body parser for handling for submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directorys
app.use(express.static("public"));


// a get route for scraping the nyt website

app.get("/scrape", function (req, res) {
    db.Article.remove({}, function(err) {
        console.log("Articles collection removed");
      });
    // First, we grab the body of the html with request
    axios.get("https://www.nytimes.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        // console.log(response)
        var $ = cheerio.load(response.data);
        // console.log(response.data)
        // Now, we grab every h2 within an article tag, and do the following:
        $("article.story").each(function (i, element) {
            var result = {}; 

            // if($(this).children("h2").children("a").text() !== undefined && $(this).children("a").attr("href") !== undefined){
            // Add the text and href of every link, and save them as properties of the result object
           
            result.title = $(this).children("h2.story-heading").children("a").text().trim();
            result.link = $(this).children("h2.story-heading").children("a").attr("href");
            
           var summ = $(this).children("p.summary").text().trim();
           if (summ) {
            result.summary = summ
           } else {
               result.summary = "Sucks for you, there's no summary."
           };

            
            // console.log("Result.summary: " + result.summary)

            // } 
            // Create a new Article using the `result` object built from scraping////
            db.Article.create(result)
                .then(function (dbArticle) {
                //view added result in the console
                 console.log(dbArticle);
                })
                .then(function(data){
                    db.Article.find({}).then(function(dbArticle){
                    // if we are able to successfully find articles, send them back to the client
                    res.json(dbArticle)
                    }).catch(function(err) {
                    res.json(err)
                    })
                })
                .catch(function (err) {
                    console.log(err)
                    // return res.json("yoo error" + err)
                });
            // console.log(result)
        });
        // res.send("scrape complete")
        
    });
    
    app.get("/articles", function (req, res) {

        db.Article.find({}).then(function(dbArticle){
            // if we are able to successfully find articles, send them back to the client
            res.json(dbArticle)
        }).catch(function(err) {
            res.json(err)
        })
    });
    app.get("/articles/:id", function(req, res) {
       
        db.Article.findOne({_id: req.params.id})
        // populate all of the notes associated with it
        .populate("note")
        .then(function(dbArticle){
          res.json(dbArticle);
        })
        .catch(function(err){
          res.json(err);
        });
      });

      app.post("/articles/:id", function(req, res) {
            db.Note.create(req.body)
          .then(function(dbNote){
         
            return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, { new: true});
          })
          .then(function(dbArticle){
            // if we successfully update an article, send it bak to the client
            res.json(dbArticle);
          })
          .catch(function(err){
            res.json(err);
          });
      })

});







app.listen(PORT, function () {
    console.log("App is running on port " + PORT);
})
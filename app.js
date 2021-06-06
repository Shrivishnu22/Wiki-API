const express = require("express");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

// Requests targeting all articles
app.route("/articles")
    .get(function(req, res) {
        Article.find(function(err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post(function(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err) {
            if (!err) {
                res.send("Successfully added new article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function(req, res) {
        Article.deleteMany(function(err) {
            if (!err) {
                res.send("Successfully Deleted all records");
            } else {
                res.send(err);
            }
        });
    });

// Requests targeting a specific articles

app.route("/articles/:articleTitle")
    .get(function(req, res) {
        Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.");
            }
        });
    })

.put(function(req, res) {
    Article.update({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true },
        function(err) {
            if (!err) {
                res.send("Successfully Updated the selected article.")
            }
        });
})

.patch(function(req, res) {
    Article.update({ title: req.params.articleTitle }, { $set: req.body },
        function(err) {
            if (!err) {
                res.send("Successfully Updated Article.");
            } else {
                res.send(err);
            }
        }
    );
})

.delete(function(req, res) {
    Article.deleteOne({ title: req.params.articleTitle },
        function(err) {
            if (!err) {
                res.send("Successfully Deleted the corresponding Article");
            } else {
                res.send(err);
            }
        });
});


app.listen(3000, function() {
    console.log("Running on port 3000");

});
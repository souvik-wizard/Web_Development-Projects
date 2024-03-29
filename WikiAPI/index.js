const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
require('dotenv').config();


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let wikiDB = async () => {
    await mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to DB");
}
wikiDB();

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

    .get(async function (req, res) {
        const articles = await Article.find()
        res.send(articles);
    })

    .post(async function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        await newArticle.save();
        res.redirect("/articles");
    })

    .delete(async function (req, res) {
        await Article.deleteMany();
        res.redirect("/articles");
    });

app.route("/articles/:articleTitle")

    .get(async (req, res) => {
        const findArticle = await Article.findOne({ title: req.params.articleTitle })
        res.send(findArticle);
    })
    .put(async (req, res) => {
        const putArticle = await Article.findOneAndUpdate(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true }
        )
        res.send(putArticle);
    })
    .patch(async (req, res) => {
        const patchArticle = await Article.findOneAndUpdate(
            { title: req.params.articleTitle },
            { $set: req.body }
        )
        res.send(patchArticle);
    })
    .delete(async (req, res) => {
        const deleteArticle = await Article.findOneAndDelete(
            { title: req.params.articleTitle }
        )
        res.send(deleteArticle);
    });

    
app.get("*", (req, res) => {
    res.redirect("/articles");
})


app.listen(80, function () {
    console.log("Server started on port 3000");
});
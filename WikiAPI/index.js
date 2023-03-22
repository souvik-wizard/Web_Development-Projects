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

app.get("/articles", async function (req, res) {
    const articles = await Article.find()
    res.send(articles);
});

app.post("/articles",async function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    await newArticle.save();
    res.redirect("/articles");
});

app.listen(80, function () {
    console.log("Server started on port 3000");
});
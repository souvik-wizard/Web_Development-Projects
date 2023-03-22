const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const express=require('express');
const ejs=require('ejs');
require('dotenv').config();


const app=express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

let wikiDB = async () => {
    await mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to DB");
}
wikiDB();

app.listen(80,function(){
    console.log("Server started on port 3000");
});
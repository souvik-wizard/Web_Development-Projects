const express=require("express")
const bodyParser=require("body-parser")

const app=express()
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html")
})

app.post("/",function(req,res){
    console.log(req.body)
 
    var n1=Number(req.body.num1)
    var n2=Number(req.body.num2)

    var ans = n1+n2

    res.send("Your number is "+ ans);
})

app.listen(3000,function(req,res){
    console.log("Out port is running")
})

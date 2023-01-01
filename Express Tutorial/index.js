const express=require("express")
const app = express()
app.get("/",function(req,res){
    res.send("now you see mee")
})
app.listen(3000,function(){
    console.log("Our port is running")
})
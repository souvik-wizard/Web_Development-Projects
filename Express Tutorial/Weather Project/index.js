const express=require("express")
const http = require("https");

const app=express()

app.get("/",function(request,response){

    

    const options = {
        "method": "GET",
        "hostname": "weatherapi-com.p.rapidapi.com",
        "port": null,
        "path": `/current.json?q=Kolkata`,
        "headers": {
            "X-RapidAPI-Key": "b772aa655cmshd6b3aab9ad7d7e0p10a524jsn57a88a590afb",
            "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
            "useQueryString": true
        }
    };
    
    const req = http.request(options, function (res) {
        // console.log(res.statusCode)
        const chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        res.on("end", function () {
            const body = Buffer.concat(chunks);

            // console.log(body.toString());
            // response.send(JSON.parse(body.toString()))

            const parseString=JSON.parse(body.toString())
            const wd=parseString.current.temp_c
            const wd2=parseString.location.name
            const wd3=parseString.location.localtime
            
            console.log(parseString)

            response.send("The current temp in " +wd2+ " is " +wd+ " degree celcious. Date & time  " +wd3)
        })
        
    });
       
    req.end();

    
})


app.listen(3000,function(req,res){
    console.log("Our server is working")
})

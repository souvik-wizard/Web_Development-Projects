require("dotenv").config()

const express=require("express")
const http = require("https")
const bodyParser=require("body-parser")
const showWeather=require("./showWeather")

const app=express()
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(request,response){
    response.sendFile(__dirname +"/index.html")   
})

app.post("/weather", function(request,response){
        const city=request.body.cityName

        const options = {
        "method": "GET", 
        "hostname": "weatherapi-com.p.rapidapi.com",
        "port": null,
        "path": `/current.json?q=${city}`,
        "headers": {
            "X-RapidAPI-Key":process.env.RANDOMER_API_TOKEN,
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
;
            // response.send(JSON.parse(body.toString()))

            const parseString=JSON.parse(body.toString())
            const wdTemp=parseString.current.temp_c
            const wdCity=parseString.location.name
            const wdTime=parseString.location.localtime
            const wdCountry=parseString.location.country
            const wdCondition=parseString.current.condition.text
            const iconUrl=("https:" +(parseString.current.condition.icon))
                
            // console.log(parseString)
            const param=showWeather(wdCity,wdCountry,wdTemp,wdTime,wdCondition,iconUrl)
    
            response.send(param)
        })
    });
    req.end();
})

app.listen(3000,function(req,res){
    console.log("Our server is working on port 3000")
})

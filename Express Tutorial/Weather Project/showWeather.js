const showWeather=(wdCity,wdCountry,wdTemp,wdTime,wdCondition,iconUrl)=>{
    return `
    <h1>The current temp in ${wdCity},  ${wdCountry} is ${wdTemp} degree celsius.</h1>
    <h2>Date & time  ${wdTime} </h2>
    <h2>Current weather condion: ${wdCondition} </h2>
    <img src=${iconUrl}>
    <form action="/" method="get"><button type="submit">Go Back</button></form>
    `
}
module.exports=showWeather;
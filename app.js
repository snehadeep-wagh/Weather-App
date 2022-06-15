const express = require("express");
const https = require("https");
const request = require("request");
const parser = require("body-parser");
const { METHODS } = require("http");

const app = express();
app.use(parser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

var lat = "", lon = "", temp = "", cityName = "", icon = "town";

// get request for home page
app.get("/", function (req, res) {
    res.render("index", { city: cityName, lat: lat, lon: lon, temp: temp, icon: icon });
});

// get request for contact us page
app.get("/contact", function (req, res) {
    res.sendFile(__dirname + "/contact.html");
});

const URI = "https://api.openweathermap.org/data/2.5/weather?q=";
const API_KEY = "32254147594c70bcc4b5cfec99de690b";
var options = {
    json: true
}

// get the response from the user
app.post("/", function (req, response) {
    cityName = req.body.city;
    const final_url = URI + cityName + "&appid=" + API_KEY + "&units=metric";
    console.log("City: " + cityName + final_url);

    request(final_url, options, function (err, res, body) {
        if (err) { return console.log("Error: " + err); }
        console.log(res.body);
        if (res.statusCode == "200") {
            lat = res.body.coord.lat;
            lon = res.body.coord.lon;
            temp = res.body.main.temp;
            icon = res.body.weather[0].main;
            if (icon == "Haze") icon = "Clouds";
        }
        else {
            cityName = "  Check you city name";
            lat = ""; lon = ""; temp = ""; icon = "town"

        }
        response.redirect("/");
        console.log("top lat: " + lat + " lon: " + lon + " temp: " + temp, "icons: " + icon);
    });
    console.log("bot lat: " + lat + " lon: " + lon + "temp: " + temp);

})

app.listen(3000, function () {
    console.log("Server is running on server: 3000");
});

//configure environment
require("dotenv").config();

//All required 
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require("fs")
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


//create variable of command given for log.txt
var commandGiven = "";
for (var i = 2; i < process.argv.length; i++) {
    var commandGiven = commandGiven + process.argv[i] + " "
}

//Main
if (process.argv[2] == "do-what-it-says") {
    //log command given in log.txt
    fs.appendFile("log.txt", commandGiven + "\n" + "\n", function (error) { })
    //read random text file
    fs.readFile("random.txt", "utf8", function (error, data) {

        //Split data into an array divided by the comma
        var dataSplit = data.split(',');

        //reassign process.argv to new values so that functions run with this data
        process.argv[2] = dataSplit[0]
        process.argv[3] = dataSplit[1]
        if (process.argv[2] == "spotify-this-song") {
            spotifyThisSong();
        }
        else if (process.argv[2] == "my-tweets") {
            tweetFunction();
        }
        else if (process.argv[2] == "movie-this") {
            movieFunction();

        }
    })
}
else if (process.argv[2] == "my-tweets") {
    //log command given in log.txt
    fs.appendFile("log.txt", commandGiven + "\n" + "\n", function (error) { })
    tweetFunction();
}
else if (process.argv[2] == "spotify-this-song") {
    //log command given in log.txt
    fs.appendFile("log.txt", commandGiven + "\n" + "\n", function (error) { })
    spotifyThisSong();
}
else if (process.argv[2] == "movie-this") {
    //log command given in log.txt
    fs.appendFile("log.txt", commandGiven + "\n" + "\n", function (error) { })
    movieFunction();
}
function spotifyThisSong() {
    var songName = ""

    for (var i = 3; i < process.argv.length; i++) {
        songName = songName + process.argv[i] + " "
    }
    //if no movie data given
    if (songName == "") {
        songName = "The Sign Ace of Base"
    }

    spotify.search({ type: 'track', query: songName, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //Artists

        console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
        //Song name
        console.log("Song Name: " + data.tracks.items[0].name);
        //Preview link of the song from spotify
        console.log("URL: " + data.tracks.items[0].external_urls.spotify)
        //Album Name that the song is from
        console.log("Album Name: " + data.tracks.items[0].album.name)
        //append to log.txt
        fs.appendFile("log.txt", "Artist(s): " + data.tracks.items[0].artists[0].name + "\n" + "Song Name: " + data.tracks.items[0].name + "\n" + "URL: " + data.tracks.items[0].external_urls.spotify + "\n" + "Album Name: " + data.tracks.items[0].album.name + "\n" + "\n", function (error) { })
    });
}
function tweetFunction() {
    var params = { screen_name: 'Fr1dgeraider' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            var tweetLog=""
            for (var i = 0; i < 20; i++) {
                //for better organization in terminal
                console.log("Tweet Number " + (i + 1))
                console.log(tweets[i].text);
                console.log(tweets[i].created_at);
                //for nicer spacing in terminal
                console.log("")
                //append to log.txt
                tweetLog=tweetLog+"Tweet Number " + (i + 1) + "\n" + tweets[i].text + "\n" + tweets[i].created_at + "\n" + "\n"
            }
            fs.appendFile("log.txt", tweetLog, function (error) { })
        }
    });
}

function movieFunction() {
    var movieName = ""

    for (var i = 3; i < process.argv.length; i++) {
        movieName = movieName + process.argv[i] + "+"
    }
    //remove extreneous + at the end
    movieName = movieName.substring(0, movieName.length - 1);
    //var to print in log.txt  
    var movieName2 = movieName.split('+').join(' ');
    //if no movie data given
    if (movieName == "") {
        movieName = "Mr.+Nobody"
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";


    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var parsedBody = JSON.parse(body)
            //    * Title of the movie.
            console.log("Movie title: " + parsedBody.Title)
            //    * Year the movie came out.
            console.log("Year released: " + parsedBody.Year);
            //    * IMDB Rating of the movie.
            console.log("IMBD Rating: " + parsedBody.imdbRating);
            //    * Rotten Tomatoes Rating of the movie.
            console.log("Rotten Tomatoes Rating: " + parsedBody.Ratings[1].Value)
            //    * Country where the movie was produced.
            console.log("Country: " + parsedBody.Country)
            //    * Language of the movie.
            console.log("Language: " + parsedBody.Language)
            //    * Plot of the movie.
            console.log("Plot: " + parsedBody.Plot)
            //    * Actors in the movie.
            console.log("Actors: " + parsedBody.Actors)

            //append log.txt
            fs.appendFile("log.txt", "Movie title: " + parsedBody.Title + "\n" + "Year released: " + parsedBody.Year + "\n" + "IMBD Rating: " + parsedBody.imdbRating + "\n" + "Rotten Tomatoes Rating: " + parsedBody.Ratings[1].Value + "\n" + "Country: " + parsedBody.Country + "\n" + "Language: " + parsedBody.Language + "\n" + "Plot: " + parsedBody.Plot + "\n" + "Actors: " + parsedBody.Actors + "\n" + "\n", function (error) { })
        }
    })
}
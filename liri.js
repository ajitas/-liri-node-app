require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var fs = require("fs");
var inquirer = require("inquirer");


function moreQuestions(){
    inquirer.prompt([{
        type:"confirm",
        message:"Do you have more questions?",
        name:"more",
        default:false
    }]).then(function(response){
        if(response.more)
        {
            initializeApp();
        }
    });
}
function initializeApp(){
    inquirer.prompt([{
        type:"list",
        message:"Which category do you want to choose?",
        choices:["spotify-this-song","movie-this","concert-this","do-what-it-says"],
        name:"category"
    }]).then(function(response){
        switch(response.category){
            case "spotify-this-song":
                                    inquirer.prompt([{
                                        type:"input",
                                        message:"Enter the Song Name",
                                        name:"name"
                                    }]).then(function(response){
                                        if(response.name)
                                            callSpotifyAPI(response.name);
                                        else
                                            callSpotifyAPI("The Sign");

                                    });
                                    break;
        case "movie-this":
                                    inquirer.prompt([{
                                        type:"input",
                                        message:"Enter the Movie Name",
                                        name:"name"
                                    }]).then(function(response){
                                        if(response.name)
                                        callOMDBAPI(response.name);
                                        else
                                        callOMDBAPI("Mr.Nobody");

                                        
                                    });
                                    break;
        case "concert-this":
                                    inquirer.prompt([{
                                        type:"input",
                                        message:"Enter the Artist/Band Name",
                                        name:"name"
                                    }]).then(function(response){
                                        if(response.name)
                                            callBandsInTownAPI(response.name);

                                        
                                    });
                                    break;
        case "do-what-it-says":
                                    callFileReader();
                                    
                                    break;
        }
    });
}
function callSpotifyAPI(songName){
    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        //console.log(data.tracks)
        console.log("Artist(s):")
        for(var i = 0; i< data.tracks.items[0].album.artists.length;i++){
            console.log(i+1+": "+data.tracks.items[0].album.artists[i].name); 
        }
        console.log("Song Name:",data.tracks.items[0].name);
        console.log("Preview Link:",data.tracks.items[0].preview_url)
        console.log("Album Name:",data.tracks.items[0].album.name);

        moreQuestions();
      });
      
}

function callOMDBAPI(movieName){
    var movieWords = movieName.split(' ');
    var movieName = "";
    for (var i = 0; i < movieWords.length; i++) {
      if (i > 0 && i < movieWords.length) {
        movieName = movieName + "+" + movieWords[i];
      }
      else {
        movieName += movieWords[i];
      }
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("Title: ",JSON.parse(body).Title);
            console.log("Year of Release: ",JSON.parse(body).Year);

            for(var i = 0; i<JSON.parse(body).Ratings.length;i++){
                if(JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes")
                    console.log("Rotten Tomatoes Rating: ",JSON.parse(body).Ratings[i].Value);
                if(JSON.parse(body).Ratings[i].Source === "Internet Movie Database")
                    console.log("IMDB Rating: ",JSON.parse(body).Ratings[i].Value);
            }
            console.log("Country: ",JSON.parse(body).Country)
            console.log("Language: ",JSON.parse(body).Language)
            console.log("Plot: ",JSON.parse(body).Plot)
            console.log("Actors: ",JSON.parse(body).Actors)
        }
        moreQuestions();
    });
    
}

function callBandsInTownAPI(artistName){
    var queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

    request(queryURL, function(error,response,body){
        if (!error && response.statusCode === 200) {

            for(var i =0;i<JSON.parse(body).length;i++){
            console.log("Venue: ",JSON.parse(body)[i].venue.name);
            console.log("Location: ",JSON.parse(body)[i].venue.city + ", "+JSON.parse(body)[i].venue.country);
            console.log("Date of concert: ", moment(JSON.parse(body)[i].datetime).format("MM/DD/YY"));
        }
    }
    moreQuestions();
    });
    
}

function callFileReader(){
    fs.readFile("random.txt", "utf8", function(error,data){
        if (error) {
            return console.log(error);
          }
        var api = data.split(',')[0];
        var name = data.split(',')[1];
        switch(api){
            case "spotify-this-song":
                if(name)
                    callSpotifyAPI(name);
                else
                    callSpotifyAPI("The Sign");
                break;
            case "movie-this":
                if(name)
                    callOMDBAPI(name);
                else
                    callOMDBAPI("Mr.Nobody");
                break;
            case "concert-this":
                if(name)
                    callBandsInTownAPI(name);
                break;
        }
    });
    
}

initializeApp();
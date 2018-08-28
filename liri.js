console.log("***********************************************************************")
console.log("**                    *         *  *****     *                       **")
console.log("**                    *         *  *   *     *                       **")
console.log("**                    *         *  *****     *                       **")
console.log("**                    *         *  *     *   *                       **")
console.log("**                    *******   *  *      *  *                       **")
console.log("***********************************************************************")
//loads environment variables from .env file
require("dotenv").config();
//get the keys from keys.js
var keys = require("./keys.js");
//import request,node-spotify-api,moment,fs,inquirer packages
var request = require("request");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var fs = require("fs");
var inquirer = require("inquirer");

//file to log the commands and responses
var logFile = "log.txt";

//Ask the user if he wants to ask more questions
function moreQuestions(){
    inquirer.prompt([{
        type:"confirm",
        message:"Do you have more questions?",
        name:"more",
        default:false
    }]).then(function(response){
        if(response.more)
            initializeApp();
    });
}

//logs the query and the response in log.txt
function log(category,name,resultString){
    fs.appendFile(logFile,category+ ",\""+ name+"\"\n"+ resultString+"\n\n", function(error){
        if(error)
            console.log(error);
    });
}

//initializes the app
function initializeApp(){
    inquirer.prompt([{
        type:"list",
        message:"Which category do you want to choose?",
        choices:["spotify-this-song","movie-this","concert-this","do-what-it-says"],
        name:"category"
    }]).then(function(response){
        //sitch case decides which API to call
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

//calls the spotify API
function callSpotifyAPI(songName){
    var resultString="";
    //get the spotify keys
    var spotify = new Spotify(keys.spotify);
    //search request to API
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        //Print the required information from data returned and also put the information in the resultString
        //resultString can be then logged into log.txt
        console.log("Artist(s):")
        resultString= "Artist(s):\n";

        //Print each artist
        for(var i = 0; i< data.tracks.items[0].album.artists.length;i++){
            console.log(i+1+": "+data.tracks.items[0].album.artists[i].name);
            resultString+= i+1+": "+data.tracks.items[0].album.artists[i].name+"\n";
        }
        //print song name
        console.log("Song Name:",data.tracks.items[0].name);
        resultString+= "Song Name:"+data.tracks.items[0].name+"\n";

        //print song preview link
        console.log("Preview Link:",data.tracks.items[0].preview_url)
        resultString+= "Preview Link:"+data.tracks.items[0].preview_url+"\n";

        //print album name
        console.log("Album Name:",data.tracks.items[0].album.name);
        resultString+= "Album Name:"+data.tracks.items[0].album.name+"\n";

        //log it to log.txt
        log("spotify-this-song",songName,resultString);
        moreQuestions();
      });
      
}

//calls OMDB API
function callOMDBAPI(movieName){
    //get the movieName and format it so that it could be sent in the query to API
    var movieWords = movieName.split(' ');
    var strMovieName = "";
    for (var i = 0; i < movieWords.length; i++) {
      if (i > 0 && i < movieWords.length) {
        strMovieName = strMovieName + "+" + movieWords[i];
      }
      else {
        strMovieName += movieWords[i];
      }
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + strMovieName + "&y=&plot=short&apikey=trilogy";

    //send request to OMDB
    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            //resultString to store the result for logging purpose
            var resultString="";

            //print the required information from result

            //Print movie title
            console.log("Title: ",JSON.parse(body).Title);
            resultString= "Title: "+JSON.parse(body).Title+"\n";

            //print release year
            console.log("Year of Release: ",JSON.parse(body).Year);
            resultString+= "Year of Release: "+JSON.parse(body).Year+"\n";

            for(var i = 0; i<JSON.parse(body).Ratings.length;i++){

                //print rotten tomatoes rating
                if(JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes"){
                    console.log("Rotten Tomatoes Rating: ",JSON.parse(body).Ratings[i].Value);
                    resultString+= "Rotten Tomatoes Rating: "+JSON.parse(body).Ratings[i].Value+"\n";
                }

                //print IMDB rating
                if(JSON.parse(body).Ratings[i].Source === "Internet Movie Database"){
                    console.log("IMDB Rating: ",JSON.parse(body).Ratings[i].Value);
                    resultString+= "IMDB Rating: "+JSON.parse(body).Ratings[i].Value+"\n";
                }
            }
            //print country it was made in
            console.log("Country: ",JSON.parse(body).Country)
            resultString+= "Country: "+JSON.parse(body).Country+"\n";

            //print the language
            console.log("Language: ",JSON.parse(body).Language)
            resultString+= "Language: "+JSON.parse(body).Language+"\n";

            //print plot
            console.log("Plot: ",JSON.parse(body).Plot)
            resultString+= "Plot: "+JSON.parse(body).Plot+"\n";

            //print actors
            console.log("Actors: ",JSON.parse(body).Actors)
            resultString+= "Actors: "+JSON.parse(body).Actors+"\n";
        }
        //log it to log.txt
        log("movie-this",movieName,resultString);
        moreQuestions();
    });
    
}

//call BandsInTown API
function callBandsInTownAPI(artistName){

    //create queryURL
    var queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

    //request the API
    request(queryURL, function(error,response,body){

        //if response is successful
        if (!error && response.statusCode === 200) {

            //resultString to store the result for logging purpose
            var resultString="";

            //get the required information from result and print it

            for(var i =0;i<JSON.parse(body).length;i++){

            //print venue name
            console.log("Venue: ",JSON.parse(body)[i].venue.name);
            resultString+= "Venue: "+JSON.parse(body)[i].venue.name+"\n";

            //print location
            console.log("Location: ",JSON.parse(body)[i].venue.city + ", "+JSON.parse(body)[i].venue.country);
            resultString+= "Location: "+JSON.parse(body)[i].venue.city + ", "+JSON.parse(body)[i].venue.country+"\n";

            //print date
            console.log("Date of concert: ", moment(JSON.parse(body)[i].datetime).format("MM/DD/YY"));
            resultString+= "Date of concert: "+ moment(JSON.parse(body)[i].datetime).format("MM/DD/YY")+"\n";
        }
    }
    //log the result in log.txt
    log("concert-this",artistName,resultString);
    moreQuestions();
    });
    
}

//reads the file and calls the appropriate API
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

//start the app
initializeApp();
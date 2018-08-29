# -liri-node-app

## About
LIRI is a Language Interpretation and Recognition Interface. LIRI is a command line node app that takes in parameters and returns back data according to parameters.

## Application Preview
![liri-node-app](liri.gif)

## Technologies used
1. Node.js
2. APIs
    * Spotify node API
    * OMDB API
    * Bands in Town Artist Events API

## Commands it takes
1. spotify-this-song
    * Takes a song name as the next parameter and uses spotify-node-api API to get the song data.
    * Example: Havana
    * It prints Artist(s), Song's name, Preview link of the song from Spotify and the Album that the song is from
    * If no song name is provided, it takes the song "The Sign" as default and prints the information

2. movie-this
    * Takes a movie name as the next parameter and uses OMDB API to get the movie data.
    * Example: Cast Away
    * It prints Title of the movie, Year the movie came out, IMDB Rating of the movie, Rotten Tomatoes Rating of the movie, Country where the movie was produced, Language of the movie, Plot of the movie and Actors in the movie.
    * If no movie name is provided, it takes "Mr.Nobody" as the default and prints the information

3. concert-this
    * Takes band/artist's name as the next parameter and uses Bands in Town Artist events API to get the events data.
    * Example: Celine Dion
    * It prints Name of the venue, Venue location and Date of the Event

4. do-what-it-says
    * No parameter needed to be provided explicitly
    * It reads the command and parameter from random.txt file and runs appropriate API from the above mentioned three APIs and returns the result on the screen.
    * Example text in random.txt: movie-this,"Home Alone"
    * This example will run OMDB API using "Home Alone" as parameter

## Node Packages used
1. dotenv
    * usage:
    ```require("dotenv").config();```
    * This is and external node package used to retreive the environment variables specified in .env file. Once the variables are  specified in .env file, it can be used be used by process.env.{ID}.
    * For more information: [dotenv](https://www.npmjs.com/package/dotenv)

2. request
    * usage
    ```require("request")```
    * request package is used to send requests for data to the above mentioned APIs and receive the response from them.
    * For more information: [request](https://www.npmjs.com/package/request)

3. node-spotify-api
    * usage
    ```require("node-spotify-api")```
    * This external package is used to send search request to spotify node API and receive result from the API
    * For more information: [node-spotify-api](https://www.npmjs.com/package/node-spotify-api)

4. moment
    * usage
    ```require("moment")```
    * moment package is used to format dates and times used in the application. In this case, we are using it to print the concert date in MM/DD/YY format
    * For more infromation: [moment](https://www.npmjs.com/package/moment)

5. inquirer
    * usage
    ```require("inquirer")```
    * inquirer package makes the application interactive. It lets the user input the parameter, choose from a list, or confirm with a 'y' or 'n' by showing an appropriate message on the screen.
    * For more information: [Inquirer](https://github.com/SBoudrias/Inquirer.js/)

6. fs
    * usage
    ```require("fs")```
    * fs is an internal node package used to let the user interact with the file system. In this application, we are reading from and writing onto different text files.
    * For more information : [fs](https://nodejs.org/api/fs.html)

7. cfonts
    * usage
    ```require("cfonts")```
    * This package lets us style the fonts on terminal. The title "LIRI" on terminal uses cfonts for a wondeful looking heading.
    * For more information : [cfonts](https://www.npmjs.com/package/cfonts)

## Logging
Each command and parameter along with the results printed for it on sceen is logged in log.txt

## Inquirer interaction
The application will keep running as long as 'y' is pressed as the response to the question "Do you have more questions?". Pressing any other key will stop the application execution.

## Execution steps
1. Download/Clone the respository.
2. Navigate on terminal to the liri-node-app folder. Create a .env file inside the folder. Once created, open the file and include the following the .env file (Replace your-spotify-id and your-spotify-secret with the spotify ID and spotify Secret received when signed up)
```
        SPOTIFY_ID=your-spotify-id
        SPOTIFY_SECRET=your-spotify-secret
```
3. Inside the folder liri-node-app on terminal, type "npm install". This will take all dependencies from package.json and install all the required packages to run the application.
4. Once the packages are installed, in the same folder, type "node liri.js" on terminal. This will start application execution.

## code snippets
```
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
```
The above code snippet makes a request to spotify API to get the details of the track given as parameter. It then prints the data required on the screen

```
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
```
The above code snippet makes a request to OMDB API to get the details of the movie given as parameter. It then prints the data required on the screen

```
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
```
The above code snippet makes a request to Bands in Town API to get details of the atrist's events given as parameter. It then prints the data required on the screen.

## Learning points
1. Installing node packages
2. Using internal and external packages in applications
3. Usage of inquirer package
4. Interacting with file system. Reading, Writing and Append.
5. Using moment package to format the date, time
6. Calling APIs using request and consuming the response returned
7. Using dotenv package to keep the environment variables/IDs hidden.

## Author 
* [Ajita Srivastava Github](https://github.com/ajitas)
* [Ajita Srivastava Portfolio](https://ajitas.github.io/Portfolio/)

## License
Standard MIT License



# -liri-node-app

## About
LIRI is a Language Interpretation and Recognition Interface. LIRI is a command line node app that takes in parameters and gives us back data.

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

## Logging
Each command and parameter along with the results printed for it on sceen is logged in log.txt

## Inquirer interaction
The application will keep running as long as 'y' is pressed as the response to the question "Do you have more questions?". Pressing any other key will stop the application execution.

## Execution steps
1. Download/Clone the respository.
2. Navigate on terminal to the liri-node-app folder. Create a .env file inside the folder. Once created, open the file and include the following the .env file:
```
        SPOTIFY_ID=your-spotify-id
        SPOTIFY_SECRET=your-spotify-secret
```
Replace your-spotify-id and your-spotify-secret with the spotify ID and spotify Secret received when signed up.
3. Inside the folder liri-node-app on terminal, type "npm install". This will take all dependencies from package.json and install all the required packages to run the application.
4. Once the packages are installed, in the same folder, type "node liri.js" on terminal. This will start application execution.

## Application Preview

## code snippets

## Learning points
1. Installing node packages
2. Using internal and external packages in applications
3. Usage of inquirer package
4. Interacting with file system. Reading, Writing and Append.
5. Using moment package to format the date, time
6. Calling APIs using request and consuming the response returned
7. Using dotenv package to keep the environment variables/IDs hidden.

## Author 
[Ajita Srivastava Github](https://github.com/ajitas)
[Ajita Srivastava Portfolio](https://ajitas.github.io/Portfolio/)

## License
Standard MIT License



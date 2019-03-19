/* eslint-disable no-console, no-process-exit */
const imdb = require('./src/imdb');
const DENZEL_IMDB_ID = 'nm0000243';
const fs = require('fs');
var Movies = new Object();

async function sandbox (actor) {

  try {
    console.log(`📽️  fetching filmography of ${actor}...`);
    const movies = await imdb(actor);
    const awesome = movies.filter(movie => movie.metascore >= 77);

    console.log(`🍿 ${movies.length} movies found.`);
    console.log(JSON.stringify(movies, null, 2));
    console.log(`🥇 ${awesome.length} awesome movies found.`);
    console.log(JSON.stringify(awesome, null, 2));
    return movies;
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}


async function test () {
  const movies = await imdb(DENZEL_IMDB_ID);
fs.writeFile("./movies.json", JSON.stringify(movies, null, 2), (err) => {
    if (err) {
        console.error(err);
        return;
      };
      console.log("File has been created");
  });
}

// ----- main ----- //
//sandbox(DENZEL_IMDB_ID);

// also export movies
exports.movies = sandbox(DENZEL_IMDB_ID);

// save into json file all movies
//test();

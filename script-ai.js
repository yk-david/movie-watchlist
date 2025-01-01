const myApiKey = "dbae6cb7";
const searchEl = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const baseApiUrl = "";

// Search Event
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  // getMovieId();
  getMovieWithId();
});

async function getMovieId() {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${myApiKey}&s=${searchEl.value}`
  );
  const movie = await response.json();
  const movieArr = movie.Search;
  return movieArr.map((movie) => movie.imdbID);
}

async function getMovieWithId() {
  const movieIdArr = await getMovieId();
  let moviesHtml = [];

  for (let id of movieIdArr) {
    const response = await fetch(`${baseApiUrl}?apikey=${myApiKey}&i=${id}`);
    const movieData = await response.json();

    moviesHtml.push(`
          <div class="movie">
              <img src="${movieData.Poster}" alt="${movieData.Title}">
              <h3>${movieData.Title}</h3>
              <p>Year: ${movieData.Year}</p>
              <p>Rating: ${movieData.imdbRating}</p>
          </div>
      `);
  }

  document.querySelector(".movie-container").innerHTML = moviesHtml.join("");
}

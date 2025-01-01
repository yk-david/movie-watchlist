const myApiKey = "dbae6cb7";
const searchEl = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const findFilmBtn = document.getElementById('find-film-btn');
const watchlistBtn = document.getElementById('watchlist-btn');
const navEl = document.querySelector('nav');
const pageUrl = window.location.href;
let movieWatchlist = [];



// Search Event
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  // Reset if any movie result from previous search
  resetMovie();
  getMovieWithId();
  searchEl.value = "";

  // Once movies rendered
  
});

// Menu click Event
navEl.addEventListener('click', e => {
  e.preventDefault();
  console.log(e.target.id);
  
  // 🚨 DETECTING id area is too generous!! Clicking on other than btn shouldn't work!! 🚨 
  if (e.target.id === 'watchlist-btn') {
    showWatchlist();
  } else {
    showSearch();
  }
})

function showWatchlist() {
  navEl.classList.toggle('make-flex-row-reverse');
  findFilmBtn.classList.remove('make-menu-selected');
  watchlistBtn.classList.add('make-menu-selected');
  document.getElementById('search').style.display = 'none';
  document.getElementById('watchlist').style.display = 'block';

  if (movieWatchlist.length !== 0) {
    renderMoviesinWatchlist();
  }
}

function showSearch() {
  navEl.classList.toggle('make-flex-row-reverse');
  findFilmBtn.classList.add('make-menu-selected');
  watchlistBtn.classList.remove('make-menu-selected');
  document.getElementById('search').style.display = 'block';
  document.getElementById('watchlist').style.display = 'none';
  resetMovie();
}

async function getMovieId() {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${myApiKey}&s=${searchEl.value}`
  );
  const movie = await response.json();
  const movieArr = movie.Search;
  return movieArr.map((movie) => movie.imdbID);
}

async function getMovieWithId() {
  const movieIdArr = await getMovieId(); // `getMovieId()` returns all id matching movies
  
  document.querySelector(".movie-container").innerHTML = "";

  for (let id of movieIdArr) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${myApiKey}&i=${id}`);
    const movie = await response.json();
    
    document.querySelector(".movie-container").innerHTML += renderMovieHTML(movie);
  }

}

function renderMovieHTML(movie) {
  return `
    <div class='movie'>
        <img src=${movie.Poster} class='movie-poster'>
        <section class='movie-meta'>
          <div class='movie-header'>
            <h2 class='movie-title'>${movie.Title}</h2>
            <p class='movie-rating'>⭐ ${movie.Ratings[0].Value.slice(0, 3)}</p>
          </div>
          <div class='movie-info'>
            <p>${movie.Runtime}</p>
            <p>${movie.Genre}</p>
            <button class='add-btn' data-movie-id='${movie.imdbID}' onclick="saveMovieInWatchlist('${movie.imdbID}')"}>✚ Watchlist</button>
          </div>
          <p class='movie-plot'>${movie.Plot}</p>
        </section>
      </div>
  `;
}

function renderWatchlistMovieHTML(movie) {
  return `
    <div class='movie'>
        <img src=${movie.Poster} class='movie-poster'>
        <section class='movie-meta'>
          <div class='movie-header'>
            <h2 class='movie-title'>${movie.Title}</h2>
            <p class='movie-rating'>⭐ ${movie.Ratings[0].Value.slice(0, 3)}</p>
          </div>
          <div class='movie-info'>
            <p>${movie.Runtime}</p>
            <p>${movie.Genre}</p>
            <button class='remove-btn' data-movie-id='${movie.imdbID}' onclick="removeMovieFromWatchlist('${movie.imdbID}')"}>⛔️ Remove</button>
          </div>
          <p class='movie-plot'>${movie.Plot}</p>
        </section>
      </div>
  `;
}

function resetMovie() {
  document.getElementById("search").innerHTML = `
    <form>
      <input type="text" id="search-input" placeholder="Search for a movie" />
      <button id="search-btn" type="submit">Search</button>
    </form>
    <div class="space"></div>

    <div class="movie-container">
      <label class="default" for="search-input">
        <img src="img/explore.png" alt="" class="exploring" />
        <h3>Start exploring</h3>
      </label>
    </div>
  `;
}

function renderSearchHTML() {
  document.body.innerHTML = `
    <header>
      <nav>
        <li>
          <a href="#" class="make-menu-selected menu" id="find-film-btn"
            >Find your film</a
          >
        </li>
        <li>
          <a href="#" class="menu" id="watchlist-btn">My Watchlist</a>
        </li>
      </nav>
      <div class="background"></div>
    </header>

    <main>
      <form>
        <input type="text" id="search-input" placeholder="Search for a movie" />
        <button id="search-btn" type="submit">Search</button>
      </form>
      <div class="space"></div>

      <div class="movie-container">
        <label class="default" for="search-input">
          <img src="img/explore.png" alt="" class="exploring" />
          <h3>Start exploring</h3>
        </label>
      </div>
    </main>
    <script src='script.js'></script>
  `
}

function saveMovieInWatchlist(movieId) {
  if (!movieWatchlist.includes(movieId)) {
    console.log(`Movie ID ${movieId} is added.`);
    movieWatchlist.push(movieId);
    document.querySelector(`button[data-movie-id='${movieId}']`).textContent = '✅ added';
  } else {
    console.log('‼️This movie is already in the watchlist!');
  }
  // ❓If movie added, change textContent of its button to ✅

}

function removeMovieFromWatchlist(movieId) {
  movieWatchlist.splice(movieWatchlist.indexOf(movieId), 1);
  renderMoviesinWatchlist();
}

async function renderMoviesinWatchlist() {
  document.getElementById('watchlist').innerHTML = '';
  for (const movieId of movieWatchlist) {
    console.log(movieId);
    const response = await fetch(`https://www.omdbapi.com/?apikey=${myApiKey}&i=${movieId}`);
    const movie = await response.json();
    
    document.getElementById('watchlist').innerHTML += renderWatchlistMovieHTML(movie);
  }

  if (movieWatchlist.length === 0) {
    document.getElementById('watchlist').innerHTML = `
      <div class="default">
        <h3>Your watchlist is looking a little empty...</h3>
        <button onclick='showSearch()'>+ Let's add some movies!</button>
      </div>
    `
  }

} 

// TEST ONLY
function logTestResult(fn) {
  console.log(fn);
}
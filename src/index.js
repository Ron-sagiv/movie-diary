//const API_Key = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWFkOTZkYjVhYzczMjE0YWJmYzdkYzRjNWM4MmUyOCIsIm5iZiI6MTc3OTQ1ODM4Ni4zNzQsInN1YiI6IjZhMTA2MTUyN2I4NDQ5MTdmZTU2M2M0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l42fW_AE4SKNtCy-Hefa-Z-n7ninsr6THrDU2XNNfP4';

const input = document.querySelector('#search-field');
const getMovieBtn = document.querySelector('#getMovieBtn');
const dialogBox = document.querySelector('#searchDialog');
const resultsContainer = document.querySelector('#resultsContainer');
const closeDialog = document.querySelector('#closeDialogBtn');



// From the Tmdb for fetching movies
    const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWFkOTZkYjVhYzczMjE0YWJmYzdkYzRjNWM4MmUyOCIsIm5iZiI6MTc3OTQ1ODM4Ni4zNzQsInN1YiI6IjZhMTA2MTUyN2I4NDQ5MTdmZTU2M2M0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l42fW_AE4SKNtCy-Hefa-Z-n7ninsr6THrDU2XNNfP4'
  }
};

// Event Listener for Search Form. Button + Enter Key press
getMovieBtn.addEventListener('click', (e) => {
  e.preventDefault();
     searchMovies();
});

input.addEventListener('keypress', (e) => {
  if (event.key === 'Enter') {
    searchMovies();
  }
});

// Fetch movies from Tmdb
async function searchMovies() {
  const title = input.value.trim();
  if (!title) return;

  showLoading();

  try {

  const response = await fetch( `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}`, options)
  
  const data = await response.json();

  displayResults(data.results);
}
catch(error) {
  showError();
  console.error(error);
}
}

// Loading results
function showLoading() {
  resultsContainer.innerHTML = `Loading results...`;

  dialogBox.showModal(); 
}

// Error loading results
function showError() {
  resultsContainer.innerHTML = `Error loading results`;
}

// Rendering movies from search result
function displayResults(movies) {

  if(!movies.length) {
    resultsContainer.innerHTML = `Sorry, no movies found with that title.`;

    return;
  }

  resultsContainer.innerHTML = '';

  movies.forEach(movie => {
    resultsContainer.appendChild(createSearchResult(movie));
  });
}

// Create individual movie cards for search result

function createSearchResult(movie) {


const poster = movie.poster_path
  ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
   : "https://placehold.co/100x150?text=No+Image";

const resultsCard = document.createElement('div'); // Main container for search result
resultsCard.className = 'flex gap-6';

const resultsPoster = document.createElement('img'); // Movie Poster search result
resultsPoster.src = poster;
resultsPoster.className = 'w-30 rounded';

const info = document.createElement('div');

const title = document.createElement('h3');
title.textContent = movie.title;
title.className = 'text-xl font-semibold';

const release = document.createElement('p');
release.textContent = `Release date: ${movie.release_date || 'Unknown'}`;
release.className = 'text-gray-500';

info.append(title, release);
resultsCard.append(resultsPoster, info);

return resultsCard;

};

closeDialog.addEventListener('click', () => {
    dialogBox.close();
});

//const API_KEY = '1843d373b23cb78c0bf4bcd1cabe152f';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const moviesGrid = document.getElementById('main-movies-grid');
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
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWFkOTZkYjVhYzczMjE0YWJmYzdkYzRjNWM4MmUyOCIsIm5iZiI6MTc3OTQ1ODM4Ni4zNzQsInN1YiI6IjZhMTA2MTUyN2I4NDQ5MTdmZTU2M2M0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l42fW_AE4SKNtCy-Hefa-Z-n7ninsr6THrDU2XNNfP4',
  },
};

// Function: Add Movie to Favorites
function addToFavorites(movie) {
  let favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
  if (!favorites.some((fav) => fav.id === movie.id)) {
    favorites.push(movie);
    localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
    alert(`"${movie.title}" successfully added to your favourites!`);
  } else {
    alert(`"${movie.title}" already exists in your favourites.`);
  }
}

// Event Listener for Search Form. Button + Enter Key press
getMovieBtn.addEventListener('click', (e) => {
  e.preventDefault();
  searchMovies();
});

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchMovies();
  }
});

// Fetch movies from Tmdb
async function searchMovies() {
  const title = input.value.trim();
  if (!title) return;

  showLoading();

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}`,
      options,
    );

    const data = await response.json();

    displayResults(data.results);
  } catch (error) {
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
  if (!movies.length) {
    resultsContainer.innerHTML = `Sorry, no movies found with that title.`;

    return;
  }

  resultsContainer.innerHTML = '';

  movies.forEach((movie) => {
    resultsContainer.appendChild(createSearchResult(movie));
  });
}

// Create individual movie cards for search result

function createSearchResult(movie) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://placehold.co/100x150?text=No+Image';

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

  const addFav = document.createElement('button');
  addFav.textContent = `Add to favourites`;
  addFav.className =
    'btn-add mt-5 w-[180px] bg-[#EF8A17] hover:bg-[#d47a13] text-black font-bold py-2 px-4 rounded transition-colors text-sm';
  addFav.addEventListener('click', () => {
    addToFavorites(movie);
  });

  info.append(title, release, addFav);
  resultsCard.append(resultsPoster, info);

  return resultsCard;
}

closeDialog.addEventListener('click', () => {
  dialogBox.close();
});

// Load popular movies on page load
async function loadPopularMovies() {
  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
      options,
    );

    const data = await response.json();

    moviesGrid.innerHTML = '';

    data.results.forEach((movie) => {
      moviesGrid.appendChild(createMovieCard(movie));
    });
  } catch (error) {
    moviesGrid.innerHTML = `
      <p class="text-red-400 text-center col-span-full">
        Error loading popular movies.
      </p>
    `;

    console.error(error);
  }
}

/**
 * Component Factory: Generates semantic HTML card fragments
 */
function createMovieCard(movie) {
  const card = document.createElement('article');
  card.className =
    'w-full bg-white overflow-hidden rounded-lg shadow-md transition-transform duration-200 hover:-translate-y-1 text-black p-4 flex flex-col h-full';

  // Construct TMDB image paths safely or fallback to a placeholder if no asset exists
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const releaseYear = movie.release_date
    ? movie.release_date.split('-')[0]
    : 'N/A';

  card.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}" class="w-full aspect-[2/3] object-cover rounded" />
    
            <h3 class="text-lg font-semibold mt-4">${movie.title}</h3>
            <p class="text-sm text-gray-500">${releaseYear}</p>
            <p class="text-sm text-gray-600 my-2">${movie.overview || 'No description.'}</p>
            <button class="btn-add py-2 mt-auto w-full bg-[#EF8A17] hover:bg-[#d47a13] text-black rounded font-semibold text-sm">
                Add to Favourites
            </button>
    `;

  card.querySelector('.btn-add').addEventListener('click', () => {
    addToFavorites(movie);
  });
  return card;
}

// Automatically load popular movies
loadPopularMovies();

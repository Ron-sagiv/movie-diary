let currentSearchResults = [];
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
    'btn-add mt-auto w-full bg-[#EF8A17] hover:bg-[#d47a13] text-black font-bold py-2 px-4 rounded transition-colors text-sm';
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
        currentSearchResults = data.results;

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
    'w-full bg-white overflow-hidden rounded-lg shadow-md transition-transform duration-200 hover:-translate-y-1 text-black p-4';

  // Construct TMDB image paths safely or fallback to a placeholder if no asset exists
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const releaseYear = movie.release_date
    ? movie.release_date.split('-')[0]
    : 'N/A';

    card.innerHTML = `
        <div class="relative w-full aspect-[2/3] bg-gray-200 mb-4 rounded overflow-hidden">
            <img src="${posterUrl}" alt="${movie.title}" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        </div>
        <div class="flex flex-col flex-grow">
            <h3 class="text-lg font-bold text-gray-800 line-clamp-1 mb-1">${movie.title}</h3>
            <p class="text-sm text-gray-500 mb-2">${releaseYear}</p>
            <p class="text-sm text-gray-600 line-clamp-3 mb-4">${movie.overview || 'No overview descriptive data provided by TMDB.'}</p>
          <button class="btn-add mt-auto w-full bg-[#EF8A17] hover:bg-[#d47a13] text-black font-bold py-2 px-4 rounded transition-colors duration-150 text-sm" data-id="${movie.id}">
    Add to Journal
</button>
        </div>
    `;

  card.querySelector('.btn-add').addEventListener('click', () => {
    addToFavorites(movie);
  });
  return card;
   

    return card;
}

// 3. Global Interactive Event Listeners

// Search button listener
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query !== '') searchMovies(query);
});

// Search input (Enter key) listener
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query !== '') searchMovies(query);
    }
});

// GLOBAL Event Listener for the "Add to Journal" buttons
document.addEventListener('click', (event) => {
    // Check if the clicked element has the 'btn-add' class
    if (event.target.classList.contains('btn-add')) {
        // Get the ID we stored in the button
        const movieId = parseInt(event.target.getAttribute('data-id'));
        
        // Find the movie in our search results list
        const movie = currentSearchResults.find(m => m.id === movieId);
        
        if (movie) {
            let favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
            
            // Check for duplicates and save
            if (!favorites.some(fav => fav.id === movie.id)) {
                favorites.push(movie);
                localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
                alert(`${movie.title} has been added to your journal!`);
            } else {
                alert(`${movie.title} is already in your journal.`);
            }
        }
    }
});
// Automatically load popular movies
loadPopularMovies();

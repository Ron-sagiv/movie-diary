// 1. Configuration Settings
const API_KEY = '1843d373b23cb78c0bf4bcd1cabe152f'; 
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// 2. DOM Element References
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const moviesGrid = document.getElementById('main-movies-grid');

/**
 * FR009: Robust Error Handling
 * Fetches search results dynamically from the live TMDB API endpoints
 */
async function searchMovies(query) {
    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)} `;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Always reset the layout container before rendering new search queries
        moviesGrid.innerHTML = '';
        
        if (data.results && data.results.length > 0) {
            data.results.forEach(movie => {
                const movieCard = createMovieCard(movie);
                moviesGrid.appendChild(movieCard);
            });
        } else {
            // FR008: Graceful Empty-Result Edge-Case Handling
            moviesGrid.innerHTML = `<p class="col-span-full text-center text-gray-400 py-12">No movies found matching "${query}".</p>`;
        }
    } catch (error) {
        console.error("Critical failure during TMDB API operation:", error);
        moviesGrid.innerHTML = `<p class="col-span-full text-center text-red-400 py-12">Unable to load movie results. Please check your network connection or API Key authorization.</p>`;
    }
}

/**
 * Component Factory: Generates semantic HTML card fragments
 */
function createMovieCard(movie) {
    const card = document.createElement('article');
    card.className = "flex flex-col bg-white overflow-hidden rounded-lg shadow-md transition-transform duration-200 hover:-translate-y-1 text-black p-4";
    
    // Construct TMDB image paths safely or fallback to a placeholder if no asset exists
    const posterUrl = movie.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` 
        : 'https://via.placeholder.com/500x750?text=No+Poster';
        
    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

    card.innerHTML = `
        <div class="relative w-full aspect-[2/3] bg-gray-200 mb-4 rounded overflow-hidden">
            <img src="${posterUrl}" alt="${movie.title}" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        </div>
        <div class="flex flex-col flex-grow">
            <h3 class="text-lg font-bold text-gray-800 line-clamp-1 mb-1">${movie.title}</h3>
            <p class="text-sm text-gray-500 mb-2">${releaseYear}</p>
            <p class="text-sm text-gray-600 line-clamp-3 mb-4">${movie.overview || 'No overview descriptive data provided by TMDB.'}</p>
            <button class="btn-add mt-auto w-full bg-[#EF8A17] hover:bg-[#d47a13] text-black font-bold py-2 px-4 rounded transition-colors duration-150 text-sm">
                Add to Journal
            </button>
        </div>
    `;

    // LocalStorage State Modification Handler
    card.querySelector('.btn-add').addEventListener('click', () => {
        let favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
        
        // Prevent writing duplicate primary records into local storage arrays
        if (!favorites.some(fav => fav.id === movie.id)) {
            favorites.push(movie);
            localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
            alert(`"${movie.title}" successfully committed to your Journal storage!`);
        } else {
            alert(`"${movie.title}" already resides within your existing Journal records.`);
        }
    });

    return card;
}

// 3. Global Interactive Event Listeners
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query !== '') searchMovies(query);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query !== '') searchMovies(query);
    }
});
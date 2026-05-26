const moviesGrid = document.getElementById('movies-grid');

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');

if (!favoriteMovies.length) {
    moviesGrid.innerHTML = `
    <p class='text-white text-xl col-span-full text-center'>
    No favourite movies added yet.
    </p>
    `;
}

// Render favorite Movies
favoriteMovies.forEach(movie => {
    moviesGrid.appendChild(createMovieCard(movie));
});


// Reused createMovieCard function from index.js 
function createMovieCard(movie) {
    const card = document.createElement('article');
    card.className = "w-full bg-white overflow-hidden rounded-lg shadow-md transition-transform duration-200 hover:-translate-y-1 text-black p-4";
    
    // Construct TMDB image paths safely or fallback to a placeholder if no asset exists
    const posterUrl = movie.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` 
        : 'https://via.placeholder.com/500x750?text=No+Poster';
        
    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

    card.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}" class="w-full aspect-[2/3] object-cover rounded" />
    
            <h3 class="text-lg font-semibold mt-4">${movie.title}</h3>
            <p class="text-sm text-gray-500">${releaseYear}</p>
            <p class="text-sm text-gray-600 mt-2">${movie.overview || 'No description.'}</p>
            <button class="remove-btn mt-4 w-full bg-red-500 text-white rounded p-2 ">
                Remove
            </button>
    `;
    const removeBtn = card.querySelector('.remove-btn'); 
    removeBtn.addEventListener('click', () => { // Remove from Favorites Function goes here...

    })

     return card;
  };


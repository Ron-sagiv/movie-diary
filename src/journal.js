const moviesGrid = document.getElementById('movies-grid');

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const favoriteMovies = JSON.parse(
  localStorage.getItem('favoriteMovies') || '[]',
);

if (!favoriteMovies.length) {
  moviesGrid.innerHTML = `
    <p class='text-white text-xl col-span-full text-center'>
    No favourite movies added yet.
    </p>
    `;
}

// Render favorite Movies
favoriteMovies.forEach((movie) => {
  moviesGrid.appendChild(createMovieCard(movie));
});

// Reused createMovieCard function from index.js
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
            <button class="remove-btn py-2 mt-auto w-full bg-red-500 hover:bg-red-800 text-white rounded text-sm font-semibold ">
                Remove
            </button>
    `;
  //Remove movie from favorites
  const removeBtn = card.querySelector('.remove-btn');

  removeBtn.addEventListener('click', () => {
    // Get favorites array //// Fallback if nothing exists "|| []" without this, app could crash.
    let favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

    // Remove current movie
    favorites = favorites.filter((fav) => fav.id !== movie.id);

    // Save updated array
    localStorage.setItem('favoriteMovies', JSON.stringify(favorites));

    alert(`Removing "${movie.title}" now from your favourites!`); //show alert message

    // Remove card from page
    card.remove();

    // Show message if no movies left
    if (favorites.length === 0) {
      moviesGrid.innerHTML = `
      <p class='text-white text-xl col-span-full text-center'>
        No favourite movies added yet.
      </p>
    `;
    }
  });
  return card;
}

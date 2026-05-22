function createMovieCard(movie) {
    const card = document.createElement('article');
    card.className = "flex flex-col bg-white overflow-hidden rounded-lg shadow-md transition-transform duration-200 hover:-translate-y-1";
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';
    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    card.innerHtml = `
    <div class="relative w-full aspect-[2/3]">
    <img src="${posterUrl}" alt="${movie.title}" class="absolute inset-0 w-full h-full object-cover" loading="lazy">
    </div>
    <div class="p-4 flex flex-col flex-grow">
    <h3 class='text-lg font-bold text-gray-800 line-clamp-1">${movie.title}</h3>
    <p class="text-sm text-gray-500 mb-2">${releaseYear}</p>
    <p class="text-sm text-gray-600 line-clamp-3 mb-4">${movie.overview || 'No description available.'}</p>
    <button class="btn-remove mt-auto w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-150">
    Remove from Journal
    </button>
    </div> 
    `;
    return card;
}

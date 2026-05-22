const getMovieBtn = document.querySelector('#getMovieBtn');
const dialogBox = document.querySelector('#searchDialog');
const closeDialog = document.querySelector('#closeDialogBtn');

// const searchResult = async () => {
//     const res = await fetch(url); //add TmDB url for fetching movies by title

//     if(!res.ok) throw new Error(`${res.status}. Something went wrong!`);

//     const data = await res.json();

//     return data
// };

getMovieBtn.addEventListener('click',(e) => {
    e.preventDefault();
    dialogBox.showModal();
});

closeDialog.addEventListener('click', () => {
    dialogBox.close();
});

// getMovieBtn.addEventListener('submit', async () => {
//     try {
//         const allMovies = await searchResult();
//         // Dialog box for the result??
//     } catch(error) {
//         alert(error.message);
//     }
// });
const getMovieBtn = document.querySelector('#getMovieBtn');
const dialogBox = document.querySelector('#searchDialog');
const closeDialog = document.querySelector('#closeDialogBtn');


// From the Tmdb for fetching movies
    const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWFkOTZkYjVhYzczMjE0YWJmYzdkYzRjNWM4MmUyOCIsIm5iZiI6MTc3OTQ1ODM4Ni4zNzQsInN1YiI6IjZhMTA2MTUyN2I4NDQ5MTdmZTU2M2M0MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l42fW_AE4SKNtCy-Hefa-Z-n7ninsr6THrDU2XNNfP4'
  }
};


getMovieBtn.addEventListener('click',(e) => {
    e.preventDefault();



fetch('https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));

   dialogBox.showModal();
});


closeDialog.addEventListener('click', () => {
    dialogBox.close();
});


// const searchResult = async () => {
//     const res = await fetch(url); //add TmDB url for fetching movies by title

//     if(!res.ok) throw new Error(`${res.status}. Something went wrong!`);

//     const data = await res.json();

//     return data
// };
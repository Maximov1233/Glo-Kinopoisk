const searchForm = document.querySelector('#search-form'),
           movie = document.querySelector('#movies'),
       urlPoster = 'https://image.tmdb.org/t/p/w500';          

function apiSearch(event){
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=36d8c684fa990596cfc7ef0d47aaeb52&language=ru&query=' + searchText;
    movie.innerHTML = 'Загрузка';

    fetch(server).then( (value) => {
        if (value.status !== 200){
            return Promise.reject(value);
        }
        return value.json();
    }).then( (output) => {
        console.log(output);

        let inner = '';
        output.results.forEach( (item) => {
            let releaseDate = item.release_date;
            if (releaseDate == undefined) {
                releaseDate = '';
                releaseDate += 'не известна';
            } 
            let nameItem = item.name || item.title;
            inner += `<div class="col-xl-3 col-md-4">
                        <img src="${urlPoster + item.poster_path}" alt="nameItem">
                      </div>
            <div class="col-xl-6 col-lg-4 col-md-4 col-sm-6 col-xs-12 movie">
                        <div class="row">
                            <div class="col-xl-6">
                                <div class="movie-title">${nameItem}</div>
                            </div> 
                            <div class="col-xl-6">
                                <p class="movie-date">Дата выпуска: <br> ${releaseDate}</p>   
                            </div>
                      </div>
                    </div>`;           
        });
        movie.innerHTML = inner;
    })
    .catch( (reason) => {
        movie.innerHTML = 'Упс, что-то пошло не так...';
        console.error('error: ' + reason.status);
    });

}
searchForm.addEventListener('submit', apiSearch);


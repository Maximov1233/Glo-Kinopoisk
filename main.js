const searchForm = document.querySelector('#search-form'),
           movie = document.querySelector('#movies'),
       urlPoster = 'https://image.tmdb.org/t/p/w500';          

function apiSearch(event){
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    if (searchText.trim().length === 0) {
        movie.innerHTML = '<h2 class="col-xl-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
        return;
    }

    movie.innerHTML = '<div class="spinner"></div>';
    

}
searchForm.addEventListener('submit', apiSearch);

function addEventMedia(){
    const media = movie.querySelectorAll('img[data-id]');
        media.forEach( (elem) =>{
            elem.style.cursor = 'pointer';
            elem.addEventListener('click', showFullInfo);
        });
}

function showFullInfo(){
    let url = '';
    if (this.dataset.type === 'movie'){
        url = 'https://api.themoviedb.org/3/movie/'+ this.dataset.id +'?api_key=36d8c684fa990596cfc7ef0d47aaeb52&language=ru';
    }else if (this.dataset.type === 'tv'){
        url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=36d8c684fa990596cfc7ef0d47aaeb52&language=ru';
    }else {
        movie.innerHTML = '<h2 class="col-xl-12 text-center text-danger">Произошла ошибка. Повторите позже</h2>';   
    }
    fetch(url).then( (value) => {
        if (value.status !== 200){
            return Promise.reject(new Error(value.status));
        }
        return value.json();
    }).then( (output) => {
        console.log(output);
        movie.innerHTML = `
                            <h4 class="text-info text-center col-xl-12">${output.name || output.title}</h4>
                            <div class="col-xl-6">
                                <img src="${urlPoster + output.poster_path}" alt="${output.name || output.title}">
                                ${(output.homepage) ? `<p class="text-center"><a href="${output.homepage}" target="_blank">Официальная страница</a></p>` : ''}
                                ${(output.imdb_id) ? `<p class="text-center"><a href="https://imdb.com/title/${output.imdb_id}" target="_blank">Страница на IMDB.com</a></p>` : ''}

                            </div>
                            <div class="col-xl-6">
                                <p>Рейтинг: ${output.vote_average} </p>
                                <p>Статус: ${output.status} </p>
                                <p>Дата премьеры: ${output.first_air_date || output.release_date} </p>

                                ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезон ${output.last_episode_to_air.episode_number} серий </p>` : ''}
                                <p> Описание: <br> ${output.overview}</p>
        </div>
        `;
    })
    .catch( (reason) => {
        movie.innerHTML = 'Упс, что-то пошло не так...';
        console.error('error: ' + reason.status);
    });
}

document.addEventListener('DOMContentLoaded', () =>{
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=36d8c684fa990596cfc7ef0d47aaeb52').then( (value) => {
        if (value.status !== 200){
            return Promise.reject(new Error(value.status));
        }
        return value.json();
    }).then( (output) => {
        let inner = '<h4 class="col-xl-12 text-center text-info">Популярные за неделю!</h4>';
        if (output.results.length === 0){
            inner = '<h2 class="text-center text-info">По вашему запросу ничего не найдено(((</h2>'
        }
        output.results.forEach( (item) => {
            let releaseDate = item.release_date;
            if (releaseDate == undefined) {
                releaseDate = '';
                releaseDate += 'не известна';
            } 
            let nameItem = item.name || item.title;
            let mediaType = item.title ? 'movie' : 'tv';
            const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.jpg';
            let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`; 
            inner += `
                        <div class="col-12 col-xl-3 col-lg-6 col-md-6 col-sm-12 col-xs-12 movie">
                            <div class="container"> 
                                <img src="${poster}" class="img-poster" alt="${nameItem}" ${dataInfo}>
                                <h5 class="movie-title text-center">${nameItem}</h5>
                                <h5 class="movie-date text-center">Дата выпуска: <br> ${releaseDate}</h5>
                            </div>                
                        </div>`;           
        });
        movie.innerHTML = inner;
        addEventMedia();     
    })
    .catch( (reason) => {
        movie.innerHTML = 'Упс, что-то пошло не так...';
        console.error('error: ' + reason.status);
    });
});
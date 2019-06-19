const searchForm = document.querySelector('#search-form'),
           movie = document.querySelector('#movies');

function apiSearch(event){
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=36d8c684fa990596cfc7ef0d47aaeb52&language=ru&query=' + searchText;
    requestApi(server);

}

searchForm.addEventListener('submit', apiSearch);

function requestApi(url){

    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if(request.status !== 200) {
            console.log('error: ' + request.status);
            return;
        }

        const output = JSON.parse(request.responseText);

        let inner = '';

        output.results.forEach(function (item, i, array) {
            let releaseDate = item.release_date;
            if (releaseDate == undefined) {
                releaseDate = '';
                releaseDate += 'не известна';
            } 
            let nameItem = item.name || item.title;
            console.log(nameItem);
            inner += `<div class="col-xl-6 col-lg-4 col-md-4 col-sm-6 col-xs-12 movie">
                        <div class="row">
                            <div class="col-xl-6>
                                <div class="movie-title">${nameItem}</div>
                            </div> 
                            <div class="col-xl-6">
                                <p class="movie-date">Дата выпуска: <br> ${releaseDate}</p>   
                            </div>
                      </div>
                    </div>       
                      `;           
        });

        movie.innerHTML = inner;
    });
}
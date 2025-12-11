let API_KEY = "88574557";
let movies = JSON.parse(localStorage.getItem("movies")) || [];
let lastSearchedMovie = null;

function save() {
    localStorage.setItem("movies", JSON.stringify(movies));
}

async function searchMovie() {
    const query = document.getElementById("movieSearch").value.trim();
    if (!query) return alert("Enter a movie name!");

    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${query}`);
    const data = await res.json();

    if (data.Response === "False") {
        document.getElementById("searchResult").innerHTML =
            `<p style="color:red;">Movie not found!</p>`;
        return;
    }

    lastSearchedMovie = data;

    document.getElementById("searchResult").innerHTML = `
        <div class="movie-card">
            <img src="${data.Poster}" class="poster">
            <h3>${data.Title} (${data.Year})</h3>
            <p><strong>IMDb:</strong> ${data.imdbRating}</p>
            <p>${data.Plot}</p>
            <button class="watch-btn" onclick="addMovieData()">Add to Watchlist</button>
        </div>
    `;
}

function addMovieData() {
    if (!lastSearchedMovie) return;

    movies.push({
        title: lastSearchedMovie.Title,
        year: lastSearchedMovie.Year,
        rating: lastSearchedMovie.imdbRating,
        plot: lastSearchedMovie.Plot,
        poster: lastSearchedMovie.Poster,
        status: "watchlist"
    });

    save();
    render();

    document.getElementById("searchResult").innerHTML = "";
    document.getElementById("movieSearch").value = "";
}

function updateStatus(index, status) {
    movies[index].status = status;
    save();
    render();
}

function deleteMovie(index) {
    movies.splice(index, 1);
    save();
    render();
}

function render() {
    const watchlistDiv = document.getElementById("watchlist");
    const watchedDiv = document.getElementById("watched");

    watchlistDiv.innerHTML = "";
    watchedDiv.innerHTML = "";

    movies.forEach((movie, index) => {
        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
        <div class="movie-card">
                    <img src="${movie.poster}" class="poster">
            <div class="movie-info>
            <h3>${movie.title} (${movie.year})</h3>
            <p><strong>IMDb:</strong> ${movie.rating}</p>
            <p>${movie.plot}</p>
            </div>

            <div class="buttons">
                ${
                    movie.status === "watchlist"
                        ? `<button class="watched-btn" onclick="updateStatus(${index}, 'watched')">Watched</button>`
                        : `<button class="watch-btn" onclick="updateStatus(${index}, 'watchlist')">Move to Watchlist</button>`
                }
                <button class="delete-btn" onclick="deleteMovie(${index})">Delete</button>
            </div>
            </div>
        `;

        movie.status === "watchlist"
            ? watchlistDiv.appendChild(card)
            : watchedDiv.appendChild(card);
    });
}

render();

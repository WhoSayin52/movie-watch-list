const watchList = JSON.parse(localStorage.getItem('watchlist')) || []
const resultSection = document.querySelector('section.movies');

renderWatchlist()


document.addEventListener('click', (event) => {

	if (event.target.classList.contains('remove-btn')) {
		removeFromWatchlist(event.target.dataset.index)
	}
	else if (event.target.parentElement.classList.contains('remove-btn')) {
		removeFromWatchlist(event.target.parentElement.dataset.index)
	}
})

function renderWatchlist() {

	if (watchList.length === 0) {
		resultSection.innerHTML = `
			<div class="no-content flex-col">
				<p class="explore-text">Your watchlist is looking a little empty...</p>
				<a href="./index.html"><button style="font-weight: 700;" class="add-watchlist-btn"><i class="fa-solid fa-circle-plus"></i>Let’s add
					some movies!</button></a>
			</div>`

		return
	}

	resultSection.innerHTML = watchList.map((movie, index) => {
		const { Title, Ratings, Runtime, Genre, Plot, Poster } = movie;
		const rating = (Ratings.length > 0) ? Ratings[0].Value.slice(0, 3) : '0.0';
		return `
			<div class="movie-card flex-row">
					<img class="movie-poster" src="${Poster}">
					<div class="details flex-col">
						<div class="title-and-ratings flex-row">
							<h2 class="movie-title">${Title}</h2>
							<p><i class="fa-solid fa-star star-icon"></i>${rating}</p>
						</div>
						<div class="time-genre-add-watchlist-btn flex-row">
							<p>${Runtime}</p>
							<p class="movie-genre">${Genre}</p>
							<button class="remove-watchlist-btn remove-btn" data-index="${index}"><i class="fa-solid fa-circle-minus"></i>Remove</button>
						</div>
						<p class="description">${Plot}</p>
					</div>
			</div>`
	}).join('')
}

function removeFromWatchlist(index) {
	watchList.splice(index, 1);
	localStorage.setItem('watchlist', JSON.stringify(watchList))
	renderWatchlist()
}

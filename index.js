const apiKey = '23fe102f'
const link = `http://www.omdbapi.com/?apikey=${apiKey}`

const resultSection = document.querySelector('section.movies');
const searchFrom = document.querySelector('form.search-form')

const watchList = JSON.parse(localStorage.getItem('watchlist')) || []
let cleanData = []

document.addEventListener('click', (event) => {

	if (event.target.classList.contains('add-watchlist-btn')) {
		addToWatchlist(event.target.dataset.index)
	}
	else if (event.target.parentElement.classList.contains('add-watchlist-btn')) {
		addToWatchlist(event.target.parentElement.dataset.index)
	}
})

searchFrom.addEventListener('submit', (event) => {
	event.preventDefault();

	formData = new FormData(searchFrom)

	const searchInput = formData.get('search-input')

	getSearchResults(searchInput)
})

async function getSearchResults(search) {

	if (search === '') {
		return null
	}

	try {
		const response = await fetch(link + `&s=${encodeURIComponent(search)}`);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}

		const result = await response.json()

		if (result.Response === 'False') {
			resultSection.innerHTML = `
				<div class="no-content flex-col">
                <p style="font-size: 1.125rem; font-weight: 800; max-width: 550px; text-align: center;" class="explore-text">Unable to find what you’re looking for. Please try another search.</p>
            </div>`
		}
		else {
			renderResults((result.Search).slice(0, 10));
		}
	}
	catch (error) {
		console.error('ERROR: ' + error.message);
		return null
	}
}

async function renderResults(results) {
	const data = await Promise.all(
		results.map(async (movie) => {
			try {
				const response = await fetch(link + `&plot=short&i=${movie.imdbID}`);
				if (!response.ok) {
					throw new Error(`Response status: ${response.status}`)
				}

				const result = await response.json()
				const { Title, Ratings, Runtime, Genre, Plot } = result

				return { Title, Ratings, Runtime, Genre, Plot, Poster: movie.Poster, Added: false }
			}
			catch (error) {
				console.error('ERROR: ' + error.message);
				return null
			}
		})
	)

	cleanData = data.filter(Boolean)
	//console.log(cleanData)

	resultSection.innerHTML = cleanData.map((movie, index) => {
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
							<button class="add-watchlist-btn" data-index="${index}"><i class="fa-solid fa-circle-plus"></i>Watchlist</button>
						</div>
						<p class="description">${Plot}</p>
					</div>
			</div>`
	}).join('')
}
let n = 0
function addToWatchlist(index) {
	if (cleanData[index].Added) {
		return
	}

	cleanData[index].Added = true
	watchList.push(cleanData[index])
	localStorage.setItem('watchlist', JSON.stringify(watchList))
}

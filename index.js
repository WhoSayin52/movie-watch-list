const apiKey = '23fe102f'
const link = `http://www.omdbapi.com/?apikey=${apiKey}`

const resultSection = document.querySelector('section.movies');
const searchFrom = document.querySelector('form.search-form')

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

		renderResults((result.Search).slice(0, 10));
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

				return { Title, Ratings, Runtime, Genre, Plot, Poster: movie.Poster }
			}
			catch (error) {
				console.error('ERROR: ' + error.message);
				return null
			}
		})
	)

	const cleanData = data.filter(Boolean)
	//console.log(cleanData)
	resultSection.innerHTML = cleanData.map((movie) => {
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
							<button class="add-watchlist-btn"><i class="fa-solid fa-circle-plus"></i>Watchlist</button>
						</div>
						<p class="description">${Plot}</p>
					</div>
			</div>`
	}).join('')
}


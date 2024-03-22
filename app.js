
const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 3001

const root = path.join(__dirname, 'public')

const jokes = [
	{ "joke": "Why did the chicken cross the road?", "punchline": "To get to the other side!" },
	{ "joke": "What do you call a fish with no eyes?", "punchline": "Fsh!" },
	{ "joke": "What do you call a bear with no teeth?", "punchline": "A gummy bear!" },
	{ "joke": "What do you call a cow with no legs?", "punchline": "Ground beef!" },
	{ "joke": "What do you call a deer with no eyes?", "punchline": "No eye deer!"},
	{ "joke": "What do you call a deer with no eyes and no legs?", "punchline": "Still no eye deer!" }
].map((joke, id) => ({ id, ...joke }))

// Middleware
app.use(express.json())
app.use(express.static('public'))

app.get('/', (request, response) => {
	  response.sendFile('index.html', { root })
})

app.get('/api/v1/random', (request, response) => {
	const randomIndex = Math.floor(Math.random() * jokes.length)
	response.json(jokes[randomIndex])
})

app.get('/api/v1/random/exclude/:id', (request, response) => {
	const { id } = request.params
	const filteredJokes = jokes.filter(joke => joke.id.toString() !== id)
	const randomIndex = Math.floor(Math.random() * filteredJokes.length)
	response.json(filteredJokes[randomIndex])
})

app.post('/api/v1/new',  (request, response) => {
	const { joke, punchline } = request.body
	jokes.push({ id: jokes.length, joke, punchline })
	response.json({ message: 'New joke added!' })
})

app.listen(port, () => console.log(`Server is running http://localhost:${port}`))
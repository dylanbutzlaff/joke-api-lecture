const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')

const router = express.Router()

const { url } = require('../secrets/mongodb.json')
const client = new MongoClient(url)

const getCollection = async (dbName, collectionName) => {
	await client.connect()
	return client.db(dbName).collection(collectionName)
}

router.get('/joke/:id', async (request, response) => {
	const { id } = request.params
	const collection = await getCollection('Jokes-API', 'Jokes')
	const joke = await collection.findOne({ "_id": new ObjectId(id) })
	response.json(joke)
})
router.get('/random', async (request, response) => {
	const collection = await getCollection('Jokes-API', 'Jokes')
	const jokes = await collection.find({ }).toArray()
	const randomIndex = Math.floor(Math.random() * jokes.length)
	response.json(jokes[randomIndex])
})

router.get('/random/exclude/:id', async (request, response) => {
	const { id } = request.params
	const collection = await getCollection('Jokes-API', 'Jokes')
	const jokes = await collection.find({ }).toArray()
	const filteredJokes = jokes.filter(({ _id }) => _id.toString() !== id)
	const randomIndex = Math.floor(Math.random() * filteredJokes.length)
	response.json(filteredJokes[randomIndex])
})

router.post('/new', async  (request, response) => {
	const { joke, punchline } = request.body
	//jokes.push({ id: jokes.length, joke, punchline })
	const collection = await getCollection('Jokes-API', 'Jokes')
	await collection.insertOne({ joke, punchline })
	response.json({ message: 'New joke added!' })
})

module.exports = router
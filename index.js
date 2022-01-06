require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
morgan.token('content', (req, res) => { return JSON.stringify(req.body)})

// Middlewares
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))
app.use(cors())

app.get("/api/persons", (req, res, next) => {
    Person.find({}).then(people => {
        res.json(people)
    })
    .catch(error => next(error))
})

app.get("/info", (req, res, next) => {
    Person.find({}).then(people => {
        const amount = people.length
        const time = new Date()
        const body = `<p>Phonebook has info for ${amount} people</p>
        <p>${time}</p>`
        res.send(body)
    })
    .catch(error => next(error))
})

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({ 
            error: "name missing"
        })
    }

    if (!body.number) {
        return res.status(400).json({ 
            error: "number missing"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
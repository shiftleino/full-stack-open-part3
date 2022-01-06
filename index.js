require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
morgan.token('content', (req, res) => { return JSON.stringify(req.body)})

// Middlewares
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))
app.use(cors())
app.use(express.static('build'))

app.get("/api/persons", (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

/*
app.get("/info", (req, res) => {
    const amount = people.length
    const time = new Date()
    const body = `<p>Phonebook has info for ${amount} people</p>
    <p>${time}</p>`
    res.send(body)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = people.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    people = people.filter(person => person.id !== id)
    res.status(204).end()
})
*/

app.post("/api/persons", (req, res) => {
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
})

const PORT = process.env.PORT
app.listen(PORT)
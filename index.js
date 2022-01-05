const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2, 
        name: "Ada Lovelace",
        number: "39-44-5323523"
    }, 
    {
        id: 3, 
        name: "Dan Abramov",
        number: "12-43-234345"
    }, 
    {
        id: 4, 
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/info", (req, res) => {
    const amount = persons.length
    const time = new Date()
    const body = `<p>Phonebook has info for ${amount} people</p>
    <p>${time}</p>`
    res.send(body)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const id = parseInt(Math.random()*10000)
    const person = {id: id, ...req.body}
    res.json(person)
})

const PORT = 3001
app.listen(PORT)
require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const Number = require('./models/note')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

var morgan = require('morgan')

app.use(
    morgan(function (tokens, req, res) {
        // POST response
        if (req.method === 'POST') {
            return [
                tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                tokens.res(req, res, 'content-length'), '-',
                tokens['response-time'](req, res), 'ms',
                JSON.stringify(req.body)
            ].join(' ')
        }

        // Default response to anything other than POST
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ].join(' ')
    })
)

// No path default response 
app.get('/', (request, response) => {
    response.send('<h1>API for fulllstackopen labs</h1>')
})


// General API info
app.get('/info', (request, response) => {
    response.send(`<p>Phone book has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

// GET all persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// GET individual person
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// DELETE a person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)


    response.status(204).end()
})

// POST new person
app.post('/api/persons', (request, response) => {
    const body = request.body;
    const submittedName = (body.name ?? null);
    const submittedNumber = (body.number ?? null);

    // No name or number are missing
    if (submittedName === null || submittedNumber === null) {
        return response.status(400).json({
            error: 'Required variables missing'
        })
    }

    // Check for dublicate name
    const duplicateFound = persons.find(person => person.name === submittedName);

    if (duplicateFound) {
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: submittedName,
        number: submittedNumber
    }


    persons = persons.concat(person)

    response.json(person)
})

// Utility function to generate "unique" IDs
const generateId = () => (Math.floor(Math.random() * 2000000000))





let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "This is the backend response",
        "number": "6666666666666666666666"
    },
    {
        "id": 5,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})







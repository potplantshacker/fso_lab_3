require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const Number = require('./models/number')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(requestLogger)

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

// GET all persons
app.get('/api/persons', (request, response) => {
  Number.find({}).then(number => {
    response.json(number)
  })
})

// GET individual person
app.get('/api/persons/:id', (request, response, next) => {
  Number.findById(request.params.id)
    .then(number => {
      if (number) {
        response.json(number)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


// DELETE a person
app.delete('/api/persons/:id', (request, response, next) => {
  Number.findByIdAndRemove(request.params.id)
    .then(response.status(204).end())
    .catch(error => next(error))
})


// PUT update person
app.put('/api/persons/:id', (request, response, next) => {
  const { content, important } = request.body

  Number.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' })
    .then(updatedNumber => {
      response.json(updatedNumber)
    })
    .catch(error => next(error))
})



// POST new person
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const submittedName = (body.name ?? null)
  const submittedNumber = (body.number ?? null)

  // No name or number are missing
  if (submittedName === null || submittedNumber === null) {
    return response.status(400).json({
      error: 'Required variables missing'
    })
  }

  /*     // Check for dublicate name
        const duplicateFound = persons.find(person => person.name === submittedName);

   }

    /*     // Check for dublicate name
        const duplicateFound = persons.find(person => person.name === submittedName);
          if (duplicateFound) {
            return response.status(400).json({
                error: 'Name must be unique'
            })
        } */

  const number = new Number({
    name: submittedName,
    number: submittedNumber
  })

  number
    .save()
    .then(savedNumber => {
      response.json(savedNumber)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})







const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

// const password = process.argv[2]
// const submittedName = process.argv[3] ?? null
// const submittedNumber = process.argv[4] ?? null


const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  name: String,
  number: String
})


const Number = mongoose.model('Number', numberSchema)



/* // No input -> GET all
if (submittedName === null && submittedNumber === null) {

  numberSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
  })
} else if (submittedName == null || submittedNumber == null) { // Invalid input
  console.log('Missing name or number!')
  process.exit(1)
} else { // Good inputs
  const number = new Number({
    name: submittedName,
    number: submittedNumber
  })

  number.save().then(result => {
    console.log('Added "' + submittedName + '" with number "' + submittedNumber + '" to phonebook')
    mongoose.connection.close()
  })

} */

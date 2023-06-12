const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(console.log('connected to MongoDB'))
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const numberSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },

  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(?=.{10}$)\d{2}-\d{7}$/.test(v) || /^(?=.{12}$)\d{3}-\d{8}$/.test(v)
      },
      message: 'Invalid phone number!'
    },
    required: [true, 'User phone number required']
  }
})

numberSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Number', numberSchema)

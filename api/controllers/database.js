const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/syc_users', (err) => {
  if (err) {
    throw err
  }
  else {
    console.log('mongo connected')    
  }
})

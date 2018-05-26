const mongoose = require('mongoose')

const model = {
  username: {type: String, default: ''},
  password: {type: String, default: ''},
  email: {type: String, default: ''},
  createdAt: {type: Date, default: null},
  role: {type: String, default: ''},
  githubId: {type: String, default: ''}
}

var userSchema = new mongoose.Schema(model)

module.exports = mongoose.model('User', userSchema)

const express = require('express')
const Router = express.Router()

const db = require('./controllers/database.js')

const UserModel = require('./models/mongo/User')

let test = new UserModel({
  username: 'Alex',
  password: '1345',
  email: 'amoinier@outlook.fr',
  createdAt: new Date(),
  role: 'developer',
  githubId: 'test123'
})

test.save((err) => {})

// const auth = require('./auth.js');

// User
// Router.use('/auth', auth);

module.exports = Router

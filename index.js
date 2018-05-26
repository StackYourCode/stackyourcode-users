const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const graphql = require('graphql').graphql
const graphQLHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

const config = require('./utils/config')

const api = require('./api/index')

const UserGraph = require('./api/models/graphql/User')

let app = express()


var query = 'query { users(githubId:"test1234") { username, password } }'  
graphql(UserGraph, query).then( function(result) {  
  console.log(JSON.stringify(result,null," "));
});

app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(bodyParser.json({limit: '50mb'}))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.use('/api', api)
app.use('/graph', graphQLHTTP({ schema: UserGraph, pretty: true }))

app.use((req, res) => {
  res.status(404).json({
    err: 'url not found',
    info: 'The link does not exist'
  })
})

app.listen(config.port, () => {
  console.log('Listening on ' + config.port)
})

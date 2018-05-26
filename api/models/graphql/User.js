const graphql = require('graphql')
const GraphQLDate = require('graphql-date')

const UserMongo = require('../mongo/User')

function getProjection (fieldASTs) {
  return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = true;
    return projections;
  }, {});
}


var userType = new graphql.GraphQLObjectType({
  name: 'user',
  description: 'user item',
  fields: () => ({
    username: {
      type: graphql.GraphQLString,
      description: 'User username'
    },
    password: {
      type: graphql.GraphQLString,
      description: 'User password'
    },
    email: {
      type: graphql.GraphQLString,
      description: 'User email'
    },
    createdAt: {
      type: GraphQLDate,
      description: 'Date of creation'
    },
    role: {
      type: graphql.GraphQLString,
      description: 'User role'
    },
    githubId: {
      type: graphql.GraphQLString,
      description: 'User github id'
    }
  })
})



var queryType = new graphql.GraphQLObjectType({  
  name: 'Query',
  fields: function () {
    return {
      users: {
        type: new graphql.GraphQLList(userType),
        args: {
          githubId: {
            name: 'githubId',
            type: graphql.GraphQLString
         }
        },
        resolve: (root, data, source, fieldASTs) => {
          let projections = getProjection(fieldASTs)
          
          return new Promise(function (resolve, reject) {
            UserMongo.find(data, projections, (err, users) => {
              if (err || !users) {
                return reject(err)
              }
              else {
                return resolve(users)
              }
            })
        });
      }
    }
  }
}
});


var MutationAdd = {  
  type: userType,
  description: 'Add a user',
  args: {
    username: {
      name: 'User username',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    }
  },
  resolve: (root, args) => {
    var newUser = new UserMongo({
      username: args.username,
    })
    return new Promise((resolve, reject) => {
      newUser.save(function (err) {
        if (err) {
          reject(err)
        }
        else {
          resolve(newUser)
        }
      })
    })
  }
}

var MutationType = new graphql.GraphQLObjectType({  
  name: 'Mutation',
  fields: {
    add: MutationAdd
  }
});


module.exports = new graphql.GraphQLSchema({  
  query: queryType,
  mutation: MutationType
});
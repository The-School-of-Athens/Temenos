const { ApolloServer } = require('apollo-server');
const temenos_module = require("./index");
const {schema, context} = temenos_module;

const server = new ApolloServer({
  schema,
  context
});

server
  .listen({
    port: 8383
  })
  .then(info => console.log(`Server started on http://localhost:${info.port}`));
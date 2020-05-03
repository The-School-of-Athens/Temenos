const { GraphQLModule } = require("@graphql-modules/core");

module.exports = new GraphQLModule({
    name: "TEMENOS_MODULE",
    typeDefs: require("./typeDefs"),
    resolvers: require("./resolvers")
});
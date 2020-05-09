const { gql } = require("apollo-server");

const typeDefs = gql`
    type Subdomain {
        config_file: String
        type: String
        port: Int
        server_name: String!
    },
    type Query {
        subdomain(id: Int!): Subdomain
        subdomains: [Subdomain]
    }
`;

module.exports = typeDefs;
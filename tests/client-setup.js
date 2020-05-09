require("cross-fetch/polyfill");
const ApolloClient = require("apollo-boost").default;

module.exports = new ApolloClient({
    uri: "http://localhost:8383",
    onError: (err) => { console.log(err) }
});
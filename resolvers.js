const subdomains_retriever = require("./subdomains_retriever");

function check_authentication(user) {
    if(process.env.IS_ATTACHED === "true") {
        if(!user) {
            throw new Error("Not authenticated");
        }
    }
}

subdomains_retriever.init();

const resolvers = {
    Query: {
        subdomain: (root, {id}, {user}) => {
            check_authentication(user);            

            return subdomains_retriever.get_subdomains()[id];
        },
        subdomains: (root, args, {user}) => {
            check_authentication(user);

            return subdomains_retriever.get_subdomains();
        }
    }
}

module.exports = resolvers
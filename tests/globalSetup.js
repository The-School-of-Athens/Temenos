require("@babel/register");

const server = require("../main");

module.exports = async () => {
    global.httpServer = server;
    await global.httpServer.listen();
    
    // Waiting for the first update of the subdomain_retriever
    await new Promise(resolve => setTimeout(resolve, 500));
};
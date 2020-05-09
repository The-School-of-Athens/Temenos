require("@babel/register");

const server = require("../main");

module.exports = async () => {
    global.httpServer = server;
    await global.httpServer.listen();
};
var path = require("path");
var spawn = require('child_process').spawn;
var util = require("util");

var server;

const VJ_SERVER_PORT = "velocity.java.server.port";
const VJ_LOADER_PATH = "velocity.java.loader.path";
const VJ_FILENAME = "velocity.java.filename";

exports.startServer = function(root) {
    var jarPath = path.join(__dirname, "../bin/velocity-cli.jar");
    var parameters = {};

    parameters[VJ_SERVER_PORT] = 12306;
    if (util.isArray(root))
        parameters[VJ_LOADER_PATH] = root.join(",");
    else if (typeof root === 'string')
        parameters[VJ_LOADER_PATH] = root;

    server = spawn("java", ["-jar", jarPath, JSON.stringify(parameters)]);
};

exports.stopServer = stopServer;

process.on("exit", function(code) {
    stopServer();
})

function stopServer() {
    if (server) server.kill();
}

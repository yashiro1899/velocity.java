'use strict';

var path = require("path");
var spawn = require('child_process').spawn;
var util = require("util");

var server;

const VJ_SERVER_PORT = 12306;
const VJ_LOADER_PATH = "velocity.java.loader.path";
const VJ_FILENAME = "velocity.java.filename";

exports.startServer = function(root) {
    var jarPath = path.join(__dirname, "../bin/velocity-cli.jar");
    var parameters = {
        "velocity.java.server.port": VJ_SERVER_PORT
    };

    root = getRoots(root);
    parameters[VJ_LOADER_PATH] = root;

    server = spawn("java", ["-jar", jarPath, JSON.stringify(parameters)]);
};

exports.stopServer = stopServer;
exports.renderOnce = renderOnce;

exports.render = function(filename, data, root, callback) {};

process.on("exit", function(code) {
    stopServer();
});

function stopServer() {
    if (server) server.kill();
}

function renderOnce(filename, data, root, callback) {
    if (typeof data === "function") {
        callback = data;
        data = {};
        root = null;
    } else if (typeof root === "function") {
        callback = root;
        root = null;
    }

    data[VJ_FILENAME] = filename;
    root = getRoots(root);
    if (root) data[VJ_LOADER_PATH] = root;
}

function getRoots(root) {
    if (util.isArray(root))
        return root.join(",");
    else if (typeof root === 'string')
        return root;

    return null;
}

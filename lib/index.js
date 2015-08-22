'use strict';

var http = require('http');
var path = require("path");
var spawn = require('child_process').spawn;
var util = require("util");

var server;
var jarPath = path.join(__dirname, "../bin/velocity-cli.jar");

var VJ_SERVER_PORT = 12306;
var VJ_LOADER_PATH = "velocity.java.loader.path";
var VJ_FILENAME = "velocity.java.filename";

process.on("exit", function(code) {
    stopServer();
});

exports.startServer = function(root) {
    var parameters = {
        "velocity.java.server.port": VJ_SERVER_PORT
    };

    root = getRoots(root);
    if (root) parameters[VJ_LOADER_PATH] = root;

    server = spawn("java", ["-jar", jarPath, JSON.stringify(parameters)]);
};

exports.stopServer = stopServer;
exports.renderOnce = renderOnce;

exports.render = function(filename, data, root, callback) {
    if (!server) {
        renderOnce(filename, data, root, callback);
        return;
    }

    if (typeof data === "function") {
        callback = data;
        data = {};
        root = null;
    } else if (typeof root === "function") {
        callback = root;
        root = null;
    }

    var result;
    var req = http.request({
        port: VJ_SERVER_PORT,
        method: "post"
    }, function(res) {
        result = [];
        res.on("data", function(buf) {
            result.push(buf);
        }).on("end", function() {
            result = Buffer.concat(result);

            if (res.statusCode !== 200) {
                result = result.toString();
                callback(result, null);
                return;
            }

            callback(null, result);
        });
    });

    req.on("error", function(err) {
        if (!result) callback(err, null);
    });

    data[VJ_FILENAME] = filename;
    root = getRoots(root);
    if (root) data[VJ_LOADER_PATH] = root;

    req.write(JSON.stringify(data));
    req.end();
};

function stopServer() {
    if (server) server.kill();
    server = null;
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

    var java = spawn("java", ["-jar", jarPath, JSON.stringify(data)]);
    var out = [],
        err = [];

    java.stdout.on("data", function(buf) {
        out.push(buf);
    }).on("end", function() {
        out = Buffer.concat(out);
    });

    java.stderr.on("data", function(buf) {
        err.push(buf);
    }).on("end", function() {
        err = Buffer.concat(err);
        err = err.toString();
    });

    java.on('close', function(code) {
        if (code === 0) err = null;
        callback(err, out);
    });
}

function getRoots(root) {
    if (util.isArray(root))
        return root.join(",");
    else if (typeof root === 'string')
        return root;

    return null;
}

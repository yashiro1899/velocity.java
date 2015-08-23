'use strict';

var http = require('http');
var path = require("path");
var spawn = require('child_process').spawn;
var util = require("util");

var jarPath = path.join(__dirname, "../bin/velocity-cli.jar");
var _server, _roots, _port;

var VJ_SERVER_PORT = "velocity.java.server.port";
var VJ_LOADER_PATH = "velocity.java.loader.path";
var VJ_FILENAME = "velocity.java.filename";

process.on("exit", function(code) {
    stopServer();
});

exports.startServer = function(port, root) {
    var parameters = {};

    if (typeof port !== 'number') {
        root = port;
        port = null;
    }
    _port = port || 12306;
    parameters[VJ_SERVER_PORT] = _port;

    _roots = getRoots(root);
    if (_roots) parameters[VJ_LOADER_PATH] = _roots;

    _server = spawn("java", ["-jar", jarPath, JSON.stringify(parameters)]);
};

exports.stopServer = stopServer;
exports.renderOnce = renderOnce;

exports.render = function(filename, data, callback) {
    if (!_server) {
        renderOnce(filename, data, _roots, callback);
        return;
    }

    if (typeof data === "function") {
        callback = data;
        data = {};
    }
    data[VJ_FILENAME] = filename;

    var req = http.request({
        port: _port,
        method: "post"
    }, function(res) {
        var result = [];
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
        renderOnce(filename, data, _roots, callback);
    });

    req.write(JSON.stringify(data));
    req.end();
};

function stopServer() {
    if (_server) _server.kill();
    _server = null;
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

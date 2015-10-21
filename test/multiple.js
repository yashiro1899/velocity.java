'use strict';

var velocity = require("../");

var roots = ["example/a", "example/b", "example"];
var cb = function () {
    process.exit();
};

function run(root, cb) {
    var start = process.hrtime();
    velocity.render("example.vm", {
        list: ["str", 43, null, true, false, {}, [], "中国"]
    }, root, function (err, data) {
        var end = process.hrtime(start);
        end = Math.round(end[0] * 1000 + end[1] / 1e6);
        if (err) {
            console.error(err);
        } else {
            console.log("%s[spent %d ms]", data.toString(), end);
            console.log("[root is '%s']\n--\n", root);
        }
        cb(err);
    });
}

velocity.startServer();
roots = roots.concat(roots);
roots = roots.concat(roots);
roots.reverse()
    .forEach(function (root) {
        cb = (function (cbb) {
            return function (err) {
                if (err) {
                    return cbb(err);
                }
                run(root, cbb);
            };
        }(cb));
    });

cb();

'use strict';

const velocity = require("../");

var args = [
    ["example.vm", {
        list: ["str", 43, null, true, false, {}, [], "中国"]
    }, "example/", "filename, data, root, callback"],
    ["example/example.vm", {
        list: ["str", 43, null, true, false, {}, [], "中国"]
    }, "filename, data, callback"],
    ["example.vm", "example/", "filename, root, callback"],
    ["example/example.vm", "filename, callback"]
];
var cb = function () {
    process.exit();
};

function run(a, cb) {
    var start = process.hrtime();
    var message = a[a.length - 1];

    velocity.render.apply(null, a.slice(0, -1)
        .concat([function (err, data) {
            var end = process.hrtime(start);
            end = Math.round(end[0] * 1000 + end[1] / 1e6);

            if (err) {
                console.error(err);
            } else {
                console.log("%s\x1b[31m[spent %d ms]", data.toString(), end);
                console.log("[velocity.render(%s)]\x1b[0m\n--\n", message);
            }
            cb(err);
    }]));
}

velocity.startServer();
args = args.concat(args);
args = args.concat(args);
args.reverse()
    .forEach(function (a) {
        cb = (function (cbb) {
            return function (err) {
                if (err) {
                    return cbb(err);
                }
                run(a, cbb);
            };
        }(cb));
    });

cb();

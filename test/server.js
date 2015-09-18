var velocity = require("../");
velocity.startServer();

setTimeout(function() {
    var start = process.hrtime();
    velocity.render("example.vm", {
        list: ["str", 43, null, true, false, {}, [], "中国"]
    }, 'example', function(err, data) {
        var end = process.hrtime(start);
        end = Math.round(end[0] * 1000 + end[1] / 1e6);

        if (err) {
            console.error(err);
            return;
        }
        console.log("%s[spent %d ms]", data.toString(), end);
        console.log("[velocity.render(filename, data, root, callback)]\n\n--\n");
    });
}, 2000);

setTimeout(function() {
var start = process.hrtime();
velocity.render("example/example.vm", {
    list: ["str", 43, null, true, false, {}, [], "中国"]
}, function(err, data) {
    var end = process.hrtime(start);
    end = Math.round(end[0] * 1000 + end[1] / 1e6);

    if (err) {
        console.error(err);
        return;
    }
    console.log("%s[spent %d ms]", data.toString(), end);
    console.log("[velocity.render(filename, data, callback)]\n\n--\n");
});
}, 3000);

setTimeout(function() {
var start = process.hrtime();
velocity.render("example.vm", "example", function(err, data) {
    var end = process.hrtime(start);
    end = Math.round(end[0] * 1000 + end[1] / 1e6);

    if (err) {
        console.error(err);
        return;
    }
    console.log("%s[spent %d ms]", data.toString(), end);
    console.log("[velocity.render(filename, root, callback)]\n\n--\n");
});
}, 4000);

setTimeout(function() {
var start = process.hrtime();
velocity.render("example/example.vm", {
}, function(err, data) {
    var end = process.hrtime(start);
    end = Math.round(end[0] * 1000 + end[1] / 1e6);

    if (err) {
        console.error(err);
        return;
    }
    console.log("%s[spent %d ms]", data.toString(), end);
    console.log("[velocity.render(filename, callback)]\n\n--\n");
    velocity.stopServer();
});
}, 5000);

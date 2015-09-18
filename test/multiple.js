var velocity = require("../");
velocity.startServer();

var i = 0;
var roots = ["example/a", "example/b", "example"];

setInterval(function() {
    var start = process.hrtime();
    velocity.render("example.vm", {
        list: ["str", 43, null, true, false, {}, [], "中国"]
    }, roots[i % 3], function(err, data) {
        var end = process.hrtime(start);
        end = Math.round(end[0] * 1000 + end[1] / 1e6);

        if (err) {
            console.error(err);
            return;
        }
        console.log("%s[spent %d ms]", data.toString(), end);
    });

    i += 1;
}, 1000);

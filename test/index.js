var velocity = require("../");

var start = process.hrtime();
velocity.renderOnce("example/example.vm", {
    list: ["str", 43, null, true, false, {}, [], "中国"]
}, function(err, data) {
    var end = process.hrtime(start);
    end = Math.round(end[0] * 1000 + end[1] / 1e6);

    if (err) {
        console.error(err);
        return;
    }
    console.log("%s[spent %d ms]", data.toString(), end);
});

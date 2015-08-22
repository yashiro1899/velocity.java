var velocity = require("../");

var start = process.hrtime();
velocity.renderOnce("example/example.vm", {
    list: ["str", 43, null, true, false, {}, [], "中国"]
}, function(err, data) {
    console.log(process.hrtime(start));
    if (err) {
        console.error(err);
        return;
    }

    console.log(data.toString());
});

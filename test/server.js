var velocity = require("../");

velocity.startServer();
setInterval(function() {
    var start = process.hrtime();
    velocity.render("example/example.vm", {
        list: ["str", 43, null, true, false, {}, [], "中国"]
    }, function(err, data) {
        console.log(process.hrtime(start));
        if (err) {
            console.error(err);
            return;
        }

        console.log(data.toString());
    });
}, 1000);

var velocity = require("../");

velocity.renderOnce("example/example.vm", {
    list: ["str", 43, null, true, false, {}, []]
}, function(err, data) {
    if (err) {
        console.error(err);
        return;
    }

    console.log(data.toString());
});

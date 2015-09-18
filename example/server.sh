#!/bin/bash

java -Dfile.encoding=UTF-8 -jar ../bin/velocity-cli.jar \
    '{"velocity.java.server.port": 12306}' &

server=$!
sleep 2

i=0
s="ab."
while [ $i -lt 9 ]; do
    c=${s:i++%3:1}
    curl http://localhost:12306/ \
        -si \
        -X POST \
        --data $'{
            "velocity.java.loader.path": "'$c'",
            "velocity.java.filename": "example.vm",
            "list": ["str", 43, null, true, false, {}, []]
        }'

    echo $'\n--\n'
    sleep 0.5
done

kill $server

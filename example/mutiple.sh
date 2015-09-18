#!/bin/bash

i=0
s="ab."
while true; do
    c=${s:i++%3:1}
    curl http://localhost:12306/ \
         -i \
         -X POST \
         --data $'{
             "velocity.java.loader.path": "'$c'",
             "velocity.java.filename": "example.vm"
         }'

    echo $'\n--\n'
    sleep 0.5
done

#!/bin/bash

java -Dfile.encoding=UTF-8 -jar ../target/velocity-cli-1.3.0.jar \
'
{
    "velocity.java.loader.path": "'$(pwd)'",
    "velocity.java.filename": "example.vm",
    "list": ["str", 43, null, true, false, {}, []]
}'

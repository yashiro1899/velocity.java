#!/bin/bash

java -jar ../target/velocity-cli-1.0.?.jar \
'
{
    "velocity.java.loader.path": "'$(pwd)'",
    "velocity.java.filename": "example.vm",
    "list": ["str", 43, null, true, false, {}, []]
}'

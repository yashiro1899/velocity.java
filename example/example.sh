#!/bin/bash

java -jar ../bin/velocity-cli.jar \
'
{
    "velocity.java.loader.path": "'$(pwd)'",
    "velocity.java.filename": "example.vm",
    "list": ["str", 43, null, true, false, {}, []]
}'

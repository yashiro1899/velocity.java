#!/bin/bash

java -Dfile.encoding=UTF-8 -jar ../bin/velocity-cli.jar \
'
{
    "velocity.java.server.port": 12306
}'

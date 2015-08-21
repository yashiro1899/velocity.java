#!/bin/bash

mvn exec:java -Dexec.mainClass="VelocityCli" -Dexec.args="
'
{
    \"velocity.java.loader.path\": \"example/\",
    \"velocity.java.server.port\": 8000
}'"

    # \"velocity.java.filename\": \"example.vm\",
    # \"list\": [\"str\", 43, null, true, false, {}, []],

#!/bin/bash

#Insert google Authentication keys.
./insertGoogleAuthKeys.sh $1 $2 $3

if [ $? -ne 0 ]; then
    exit 1
fi

#Start cassandra
mvn -f ../pom.xml cassandra:run 2> cassandra.error >cassandra.log &
echo "$!" >tatamiPID

#start jetty
mvn -f ../pom.xml jetty:run 2> jetty.error >jetty.log &
echo "$!" >> tatamiPID


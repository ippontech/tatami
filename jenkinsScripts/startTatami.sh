#!/bin/bash

#Arguments usage: googleKey googleSecret serverURL

#Insert google auth variables into the build. 
googleKey=$1
googleSecret=$2
newServer="$3

replaceKey='${tatami.google.clientId}'
replaceSecret='${tatami.google.clientSecret}'
oldServer="<tatami.url>http:\/\/localhost:8080<\/tatami.url>"

find ../src -name *security.xml | xargs sed -i "s/$replaceSecret/$googleSecret/g" 
find ../src -name *security.xml | xargs sed -i "s/$replaceKey/$googleKey/g" 
sed -i "s/$oldServer/$newServer/g" ../pom.xml

#Start cassandra
mvn -f ../pom.xml cassandra:run 2> cassandra.error >cassandra.log &
echo "$!" >tatamiPID

#start jetty
mvn -f ../pom.xml jetty:run 2> jetty.error >jetty.log &
echo "$!" >> tatamiPID


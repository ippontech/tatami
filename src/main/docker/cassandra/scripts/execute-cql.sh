#!/usr/bin/env bash

function log {
    echo "[$(date)]: $*"
}

#usage checks
if [ -z "$1" ]
  then
    echo "usage: ./execute-cql cqlFile.cql"
    exit 1
fi
if [ -z "$KEYSPACE_NAME" ]
  then
    echo "KEYSPACE_NAME env variable must be defined"
    exit 1
fi
if [ -z "$CASSANDRA_CONTACT_POINT" ]
  then
    echo "CASSANDRA_CONTACT_POINT env variable must be defined"
    exit 1
fi

cqlFile=$1
filename=${cqlFile##*/}

log "execute: " $filename
echo "USE $KEYSPACE_NAME;" > $filename
cat $cqlFile >> $filename
cqlsh -f $filename $CASSANDRA_CONTACT_POINT

if [ $? -ne 0 ]; then
    log "fail to apply script " $filename
    log "stop applying database changes"
    exit 1
fi

exit 0

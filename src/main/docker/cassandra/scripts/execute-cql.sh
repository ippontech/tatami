#!/usr/bin/env bash

# todo usage

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

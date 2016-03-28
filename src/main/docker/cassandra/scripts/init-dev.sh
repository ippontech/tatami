#!/bin/bash

# Protect from iterating on empty directories
shopt -s nullglob

CASSANDRA_CONTACT_POINT="tatami-cassandra"
KEYSPACE_NAME="TatamiJHipster"

function log {
    echo "[$(date)]: $*"
}

function waitForClusterConnection() {
    retryCount=0
    maxRetry=20
    cqlsh -e "Describe KEYSPACES;" $CASSANDRA_CONTACT_POINT &>/dev/null
    while [ $? -ne 0 ] && [ "$retryCount" -ne "$maxRetry" ]; do
        log 'cassandra not reachable yet. sleep and retry. retryCount =' $retryCount
        sleep 5
        ((retryCount+=1))
        cqlsh -e "Describe KEYSPACES;" $CASSANDRA_CONTACT_POINT &>/dev/null
    done

    if [ $? -eq 0 ]; then
      log "connected to cassandra cluster"
    else
      log "not connected after " $retryCount " retry. Abort the migration."
      exit 1
    fi
}

function executeScripts() {
    local filePattern=$1

    # loop over migration scripts
    for cqlFile in $filePattern; do
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
    done
}

waitForClusterConnection

log "execute migration scripts"

log "create keyspace and base tables"
cat /cql/create-keyspace.cql > create-keyspace-tables.cql
echo "USE $KEYSPACE_NAME;" >> create-keyspace-tables.cql
cat /cql/create-tables.cql >> create-keyspace-tables.cql
cqlsh -f create-keyspace-tables.cql $CASSANDRA_CONTACT_POINT

executeScripts /cql/*_added_entity_*.cql
executeScripts /cql/migration/V*.cql

log "migration done"
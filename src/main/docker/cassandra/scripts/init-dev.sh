#!/bin/bash

# Protect from iterating on empty directories
shopt -s nullglob

function log {
    echo "[$(date)]: $*"
}

retryCount=0
maxRetry=20
cqlsh -e "Describe KEYSPACES;" tatami-cassandra &>/dev/null
while [ $? -ne 0 ] && [ "$retryCount" -ne "$maxRetry" ]; do
    log 'cassandra not reachable yet. sleep and retry. retryCount =' $retryCount
    sleep 5
    ((retryCount+=1))
    cqlsh -e "Describe KEYSPACES;" tatami-cassandra &>/dev/null
done

if [ $? -eq 0 ]; then
  log "connected to cassandra cluster"
else
  log "not connected after " $retryCount " retry. Abort the migration."
  exit 1
fi

log "execute migration scripts"

log "create keyspace and base tables"
cat /cql/create-keyspace.cql > create-keyspace-tables.cql
echo "USE TatamiJHipster;" >> create-keyspace-tables.cql
cat /cql/create-tables.cql >> create-keyspace-tables.cql
cqlsh -f create-keyspace-tables.cql tatami-cassandra

# loop over new entities scripts
for cqlFile in /cql/*_added_entity_*.cql; do
    filename=${cqlFile##*/}
    log "execute: " $filename
    echo "USE TatamiJHipster;" > $filename
    cat $cqlFile >> $filename
    cqlsh -f $filename tatami-cassandra
    if [ $? -ne 0 ]; then
        log "fail to apply script " $filename
        log "stop applying database changes"
        exit 1
    fi
done

# loop over migration scripts
for cqlFile in /cql/migration/V*.cql; do
    filename=${cqlFile##*/}
    log "execute: " $filename
    echo "USE TatamiJHipster;" > $filename
    cat $cqlFile >> $filename
    cqlsh -f $filename tatami-cassandra
    if [ $? -ne 0 ]; then
        log "fail to apply script " $filename
        log "stop applying database changes"
        exit 1
    fi
done

log "migration done"
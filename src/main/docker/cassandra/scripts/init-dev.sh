#!/bin/bash

function log {
    echo "[$(date)]: $*"
}

cat /cql/create-keyspace.cql > create-keyspace-tables.cql
echo "USE TatamiJHipster;" >> create-keyspace-tables.cql
cat /cql/create-tables.cql >> create-keyspace-tables.cql

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

log "launch migration script"
cqlsh -f create-keyspace-tables.cql --connect-timeout=60 tatami-cassandra

if [ $? -eq 0 ]; then
  log "migration done"
  exit 0
else
  log "migration failed"
  exit 1
fi
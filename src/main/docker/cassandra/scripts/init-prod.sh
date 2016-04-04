#!/usr/bin/env bash

cat /cql/create-keyspace-prod.cql > create-keyspace-tables.cql
echo "USE $KEYSPACE_NAME;" >> create-keyspace-tables.cql
cat /cql/create-tables.cql >> create-keyspace-tables.cql
cqlsh -f create-keyspace-tables.cql $CASSANDRA_CONTACT_POINT

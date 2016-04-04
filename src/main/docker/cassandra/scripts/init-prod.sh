#!/usr/bin/env bash

KEYSPACE_NAME=tatamijhipster
cqlsh -f /cql/create-keyspace.cql $CASSANDRA_CONTACT_POINT
cqlsh -k $KEYSPACE_NAME -f /cql/create-tables-prod.cql $CASSANDRA_CONTACT_POINT

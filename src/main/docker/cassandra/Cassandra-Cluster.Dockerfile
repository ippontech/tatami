FROM cassandra:2.2.3

# script to initialize the keyspace and the base tables
ADD cassandra/scripts/init-prod.sh /usr/local/bin/init-prod
RUN chmod 755 /usr/local/bin/init-prod

# script to execute cql scripts within the container
ADD cassandra/scripts/execute-cql.sh /usr/local/bin/execute-cql
RUN chmod 755 /usr/local/bin/execute-cql

CMD ["cassandra", "-f"]

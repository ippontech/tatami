FROM cassandra:2.2.3

# script to initialize the database
ADD cassandra/scripts/autoMigrate.sh /usr/local/bin/autoMigrate
RUN chmod 755 /usr/local/bin/autoMigrate

ADD cassandra/scripts/init-dev.sh /usr/local/bin/init-dev
RUN chmod 755 /usr/local/bin/init-dev

ADD cassandra/scripts/execute-cql.sh  /usr/local/bin/execute-cql
RUN chmod 755 /usr/local/bin/execute-cql

ENTRYPOINT ["autoMigrate"]

FROM cassandra:2.2.3

# script to initialize the database
ADD cassandra/scripts/autoMigrate.sh /usr/local/bin/autoMigrate
RUN chmod 755 /usr/local/bin/autoMigrate

ENTRYPOINT ["autoMigrate"]

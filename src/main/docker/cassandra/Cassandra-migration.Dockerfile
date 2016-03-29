FROM cassandra:2.2.3

# script to initialize the database
ADD cassandra/scripts/migrate.sh /usr/local/bin/migrate
RUN chmod 755 /usr/local/bin/migrate

ENTRYPOINT ["migrate"]

FROM cassandra:2.2.3

# script to initialize the database
ADD cassandra/scripts/init-dev.sh /usr/local/bin/init
RUN chmod 755 /usr/local/bin/init

ENTRYPOINT ["init"]

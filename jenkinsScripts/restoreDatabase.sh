#!/bin/bash

rm -rf ../target/cassandra || true
rm -rf ./target/elasticsearch || true

tar -zxvf save.tar.gz -C ../target/
tar -zxvf db.tar.gz -C ./target/

rm -f save.tar.gz || true

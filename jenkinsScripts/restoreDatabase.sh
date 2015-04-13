#!/bin/bash

rm -rf ../target/cassandra || true
tar -zxvf save.tar.gz -C ../target/

rm -f save.tar.gz

#!/bin/bash

tar -zcvf save.tar.gz ../target/cassandra ../target/elasticsearch
tar -zcvf db.tar.gz ./target/elasticsearch

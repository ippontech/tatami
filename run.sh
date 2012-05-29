#!/bin/sh
#
# description: Run Tatami in production
#
sh -c "mvn cassandra:start jetty:run-forked  -P ippon &"
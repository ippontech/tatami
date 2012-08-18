#!/bin/bash
#
# description: Tatami service for installation in init.d (auto start at server boot)
#
hostname=`hostname`
case $1 in
start)
        echo "Starting Tatami service on $hostname..."
        #mvn cassandra:start jetty:run -P ippon -Dmaven.test.skip=true
        ;;
stop)
        echo "Stopping Tatami service on $hostname..."
        pkill -f tatami
        ;;
restart)
        echo "Restarting Tatami service on $hostname..."
        pkill -f tatami
        #mvn cassandra:start jetty:run -P ippon -Dmaven.test.skip=true
        ;;
esac
exit 0
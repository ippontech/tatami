#!/bin/sh
#
# description: Updates Tatami from Git
# This script must be run by the "tatami" user, who must be a sudoer.
echo "Welcome to the Tatami updater"

#################################
# Variables
#################################
echo "Setting up variables"
export USER=tatami
export TATAMI_DIR=/opt/tatami

#################################
# Update application
#################################
cd $TATAMI_DIR/application/tatami
git pull
cd /opt/tatami/application/tatami && mvn -Pprod -DskipTests clean package
sudo /etc/init.d/jetty stop
sudo cp /opt/tatami/application/tatami/target/root.war /opt/jetty/webapps/root.war
sudo /etc/init.d/jetty start

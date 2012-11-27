#!/bin/sh
#
# description: Updates Tatami from Git
# This script must be run by the "root" user.
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
su - $USER -c "cd /opt/tatami/application/tatami && mvn -Ppreprod -DskipTests clean package"
/etc/init.d/jetty stop
cp /opt/tatami/application/tatami/target/root.war /opt/jetty/webapps/root.war
/etc/init.d/jetty start

#!/bin/sh
#
# description: Installs Tatami on Ubuntu
# This script must be run by the "root" user.
#
# - Tatami is installed in the "/opt/tatami" directory
# - Tatami is run by the "tatami" user
#

#################################
# Install missing packages
#################################

apt-get install git-core -y --force-yes

#################################
# Variables
#################################

export USER=tatami
export TATAMI_DIR=/opt/tatami
export CASSANDRA_VERSION=1.1.3

#################################
# Create directories & users
#################################

useradd $USER

mkdir -p $TATAMI_DIR
mkdir -p $TATAMI_DIR/cassandra
mkdir -p $TATAMI_DIR/application
mkdir -p $TATAMI_DIR/data
mkdir -p $TATAMI_DIR/log

#################################
## Install Cassandra
#################################

cd $TATAMI_DIR/cassandra

# Cassandra Installation
wget http://apache.crihan.fr/dist/cassandra/$CASSANDRA_VERSION/apache-cassandra-$CASSANDRA_VERSION-bin.tar.gz
tar -xzvf apache-cassandra-$CASSANDRA_VERSION-bin.tar.gz
rm -f apache-cassandra-$CASSANDRA_VERSION-bin.tar.gz

# Install JNA (used by Cassandra in production : http://www.datastax.com/docs/1.1/install/install_jre#install-jna )
cd $TATAMI_DIR/cassandra/apache-cassandra-$CASSANDRA_VERSION-bin/lib
wget https://github.com/twall/jna/blob/3.4.0/dist/jna.jar?raw=true

echo "$USER soft memlock unlimited"  >> /etc/security/limits.conf
echo "$USER hard memlock unlimited"  >> /etc/security/limits.conf

#################################
## Install Application
#################################

cd $TATAMI_DIR/application

git clone https://github.com/ippontech/tatami.git


#################################
# Post install
#################################

chown -R tatami $TATAMI_DIR
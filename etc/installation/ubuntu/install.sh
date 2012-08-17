#!/bin/sh
#
# description: Installs Tatami on Ubuntu
# This script must be run by the "root" user.
# Run this script directly by typing :
# ﻿curl -L https://github.com/ippontech/tatami/raw/master/etc/installation/ubuntu/install.sh | sudo bash
#
# - Tatami is installed in the "/opt/tatami" directory
# - Tatami is run by the "tatami" user
#
echo "Welcome to the Tatami installer"

#################################
# Variables
#################################
echo "Setting up variables"
export USER=tatami
export TATAMI_DIR=/opt/tatami
export CASSANDRA_VERSION=1.1.3
export MAVEN_VERSION=3.0.4

#################################
# Install missing packages
#################################
echo "Installing missing packages"
apt-get install git-core openjdk-7-jdk curl -y --force-yes

#################################
# Create directories & users
#################################
echo "Creating directories and users"
useradd -m -s /bin/bash $USER

mkdir -p $TATAMI_DIR
mkdir -p $TATAMI_DIR/application
mkdir -p $TATAMI_DIR/cassandra
mkdir -p $TATAMI_DIR/maven
mkdir -p $TATAMI_DIR/data
mkdir -p $TATAMI_DIR/log

#################################
## Download Application
#################################
echo "Getting the application from Github"
cd $TATAMI_DIR/application

git clone https://github.com/ippontech/tatami.git

#################################
## Install Cassandra
#################################
echo "Installing Cassandra"
cd $TATAMI_DIR/cassandra

# Cassandra Installation
wget http://apache.crihan.fr/dist/cassandra/$CASSANDRA_VERSION/apache-cassandra-$CASSANDRA_VERSION-bin.tar.gz
tar -xzf apache-cassandra-$CASSANDRA_VERSION-bin.tar.gz
rm -f apache-cassandra-$CASSANDRA_VERSION-bin.tar.gz
ln -s $TATAMI_DIR/cassandra/apache-cassandra-$CASSANDRA_VERSION $TATAMI_DIR/cassandra/current

echo "Installing JNA"
# Install JNA (used by Cassandra in production : http://www.datastax.com/docs/1.1/install/install_jre#install-jna )
cd $TATAMI_DIR/cassandra/apache-cassandra-$CASSANDRA_VERSION/lib
wget https://github.com/twall/jna/blob/3.4.0/dist/jna.jar?raw=true
cd $TATAMI_DIR/cassandra

echo "$USER soft memlock unlimited"  >> /etc/security/limits.conf
echo "$USER hard memlock unlimited"  >> /etc/security/limits.conf

# Copy Cassandra configuration
echo "Configuring Cassandra"
cp $TATAMI_DIR/application/tatami/etc/installation/ubuntu/files/cassandra/cassandra.yaml $TATAMI_DIR/cassandra/apache-cassandra-$CASSANDRA_VERSION/conf
cp $TATAMI_DIR/application/tatami/etc/installation/ubuntu/files/cassandra/cassandra-env.sh $TATAMI_DIR/cassandra/apache-cassandra-$CASSANDRA_VERSION/conf
cp $TATAMI_DIR/application/tatami/etc/installation/ubuntu/files/cassandra/log4j-server.properties $TATAMI_DIR/cassandra/apache-cassandra-$CASSANDRA_VERSION/conf

#################################
## Install Maven
#################################
echo "Installing Maven"

cd $TATAMI_DIR/maven

wget http://apache.cict.fr/maven/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz
tar -xzf apache-maven-$MAVEN_VERSION-bin.tar.gz
rm -f apache-maven-$MAVEN_VERSION-bin.tar.gz
ln -s $TATAMI_DIR/maven/apache-maven-$MAVEN_VERSION $TATAMI_DIR/maven/current

# Configure Maven for the tatami user
echo "# Begin tatami configuration" ﻿>> /home/tatami/.bashrc
echo "export M2_HOME=/opt/tatami/maven/current" >> /home/tatami/.bashrc
echo "export PATH=/opt/tatami/maven/current/bin:$PATH" ﻿>> /home/tatami/.bashrc
echo "export MAVEN_OPTS=-XX:MaxPermSize=64m -Xms256m -Xmx512m" ﻿>> /home/tatami/.bashrc
echo "# End tatami configuration" ﻿>> /home/tatami/.bashrc

# Configure Maven repository
mkdir -p $TATAMI_DIR/maven/repository
cp $TATAMI_DIR/application/tatami/etc/installation/ubuntu/files/maven/settings.xml $TATAMI_DIR/maven/apache-maven-$MAVEN_VERSION/conf

#################################
## Install Application
#################################
cd /opt/tatami/application/tatami
sudo -u tatami mvn clean install

#################################
## Post install
#################################

chown -R $USER $TATAMI_DIR


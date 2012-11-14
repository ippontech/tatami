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
export MAVEN_VERSION=3.0.4
export JETTY_VERSION=8.1.8.v20121106

#################################
# Install missing packages
#################################
echo "Installing missing packages"
apt-get install git-core curl wget -y --force-yes

#################################
# Install Java
#################################
wget https://github.com/flexiondotorg/oab-java6/raw/0.2.6/oab-java.sh -O oab-java.sh
chmod +x oab-java.sh
sudo ./oab-java.sh
rm oab-java.sh
sudo apt-get install sun-java6-jdk -y

#################################
# Create directories & users
#################################
echo "Creating directories and users"
useradd -m -s /bin/bash $USER

mkdir -p $TATAMI_DIR
mkdir -p $TATAMI_DIR/application
mkdir -p $TATAMI_DIR/maven
mkdir -p $TATAMI_DIR/lucene
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
cd $TATAMI_DIR

echo "Installing JNA"
sudo apt-get install libjna-java -y

echo "Configuring OS limits"
cp /etc/security/limits.conf /etc/security/limits.conf.original

echo "* soft nofile 32768" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 32768" | sudo tee -a /etc/security/limits.conf
echo "root soft nofile 32768" | sudo tee -a /etc/security/limits.conf
echo "root hard nofile 32768" | sudo tee -a /etc/security/limits.conf

echo "* soft nofile 32768"  >> /etc/security/limits.conf
echo "* hard nofile 32768"  >> /etc/security/limits.conf
echo "root soft nofile 32768"  >> /etc/security/limits.conf
echo "root hard nofile 32768"  >> /etc/security/limits.conf
echo "* soft memlock unlimited"  >> /etc/security/limits.conf
echo "* hard memlock unlimited"  >> /etc/security/limits.conf
echo "root soft memlock unlimited"  >> /etc/security/limits.conf
echo "root hard memlock unlimited"  >> /etc/security/limits.conf
echo "* soft as unlimited"  >> /etc/security/limits.conf
echo "* hard as unlimited"  >> /etc/security/limits.conf
echo "root soft as unlimited"  >> /etc/security/limits.conf
echo "root hard as unlimited"  >> /etc/security/limits.conf

sysctl -w vm.max_map_count=131072

sudo swapoff --all

# Cassandra Installation
echo "Installing Cassandra"
echo "deb http://debian.datastax.com/community stable main"  >> /etc/apt/sources.list
curl -L http://debian.datastax.com/debian/repo_key | sudo apt-key add -
sudo apt-get update
sudo apt-get install python-cql dsc1.1 -y
sudo apt-get install opscenter-free -y

sudo service opscenterd start

#################################
## Install Jetty
#################################
echo "Installing Jetty"
cd $TATAMI_DIR

sysctl -w net.core.rmem_max=16777216
sysctl -w net.core.wmem_max=16777216
sysctl -w net.ipv4.tcp_rmem="4096 87380 16777216"
sysctl -w net.ipv4.tcp_wmem="4096 16384 16777216"
sysctl -w net.core.somaxconn=4096
sysctl -w net.core.netdev_max_backlog=16384
sysctl -w net.ipv4.tcp_max_syn_backlog=8192
sysctl -w net.ipv4.tcp_syncookies=1
sysctl -w net.ipv4.ip_local_port_range="1024 65535"
sysctl -w net.ipv4.tcp_tw_recycle=1
sysctl -w net.ipv4.tcp_congestion_control=cubic

wget http://central.maven.org/maven2/org/mortbay/jetty/dist/jetty-deb/$JETTY_VERSION/jetty-deb-$JETTY_VERSION.deb
dpkg -i jetty-deb-$JETTY_VERSION.deb
rm -f jetty-deb-$JETTY_VERSION.deb
rm -rf /opt/jetty/webapps/*

#################################
## Install Maven
#################################
echo "Installing Maven"

cd $TATAMI_DIR/maven

wget http://mirrors.linsrv.net/apache/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz
tar -xzf apache-maven-$MAVEN_VERSION-bin.tar.gz
rm -f apache-maven-$MAVEN_VERSION-bin.tar.gz
ln -s $TATAMI_DIR/maven/apache-maven-$MAVEN_VERSION $TATAMI_DIR/maven/current

# Configure Maven for the tatami user
echo "# Begin tatami configuration" ﻿>> /home/tatami/.profile
echo "export M2_HOME=/opt/tatami/maven/current" >> /home/tatami/.profile
echo "export PATH=/opt/tatami/maven/current/bin:$PATH" >> /home/tatami/.profile
echo "export MAVEN_OPTS=\"-XX:MaxPermSize=64m -Xms256m -Xmx1024m\"" >> /home/tatami/.profile
echo "# End tatami configuration" ﻿>> /home/tatami/.profile

# Configure Maven repository
mkdir -p $TATAMI_DIR/maven/repository
cp $TATAMI_DIR/application/tatami/etc/installation/ubuntu/files/maven/settings.xml $TATAMI_DIR/maven/apache-maven-$MAVEN_VERSION/conf

#################################
## Install & run Application
#################################
chown -R $USER $TATAMI_DIR
./update.sh

#################################
## Post install
#################################

#!/bin/sh
#
# description: Uninstalls Tatami on Ubuntu
# This script must be run by the "root" user.
#
# Run this script directly by typing :
# ﻿curl -L https://github.com/ippontech/tatami/raw/master/etc/installation/ubuntu/uninstall.sh | sudo bash
#
# - Deletes the "/opt/tatami"
# - Deletes the "tatami" user

echo "Tatami uninstaller"

mv /etc/security/limits.conf.original /etc/security/limits.conf

userdel -f -r tatami

echo "Delete Tatami directory"
rm -rf /opt/tatami
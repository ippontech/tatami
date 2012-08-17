#!/bin/sh
#
# description: Uninstalls Tatami on Ubuntu
# This script must be run by the "root" user.
#
# - Deletes the "/opt/tatami"
# - Deletes the "tatami" user

echo "Remove Tatami user"

# Remove JNA settings
sed '/tatami/d' /etc/security/limits.conf

userdel -f tatami

echo "Delete Tatami directory"
rm -rf /opt/tatami
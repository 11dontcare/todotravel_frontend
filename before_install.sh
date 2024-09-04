#!/bin/bash

# Stop Nginx if it's running
echo "Stopping Nginx"
sudo systemctl stop nginx || true

# Remove old files
rm -rf /home/ec2-user/app/*
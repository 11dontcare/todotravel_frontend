#!/bin/bash
cd /home/ec2-user/app

# Start or restart Nginx
echo "Starting or restarting Nginx"
sudo systemctl start nginx || sudo systemctl restart nginx

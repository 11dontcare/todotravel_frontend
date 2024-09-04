#!/usr/bin/env bash
echo "> 리액트 페이지 배포 완료"

echo "Starting or restarting Nginx..."
sudo systemctl start nginx || sudo systemctl restart nginx
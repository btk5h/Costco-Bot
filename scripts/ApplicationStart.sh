#!/usr/bin/env bash
source /home/ec2-user/.bash_profile

pm2 start /dev/app/app.js
pm2 save

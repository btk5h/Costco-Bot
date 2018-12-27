#!/usr/bin/env bash
source /home/ec2-user/.bash_profile

pm2 stop all
pm2 delete all

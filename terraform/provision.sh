#!/bin/sh
set -e

sudo yum update -y
sudo yum install -y ruby wget make glibc-devel gcc patch
cd /home/ec2-user
wget https://aws-codedeploy-us-west-1.s3.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | sh
. ~/.nvm/nvm.sh
nvm install 10.14.2

npm install pm2 yarn -g --no-progress

sudo env PATH=$PATH:/home/ec2-user/.nvm/versions/node/v10.14.2/bin \
    pm2 startup systemd -u ec2-user
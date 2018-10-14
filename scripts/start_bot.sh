#!/bin/sh
cd /var/app
yarn start > ./bot.log 2> ./bot.log < /dev/null &
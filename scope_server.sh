#!/bin/bash
cd /home/pi/data_collector_access_point
node server.js > /dev/null &
#sudo node server.js >> node.log &

#sudo /usr/bin/node server.js 
#/usr/bin/node server.js >> /home/pi/Documents/dev/data_point_access_point/data_collector_AP/node.log

#sudo /usr/bin/node /home/pi/data_collector_access_point/server.js &

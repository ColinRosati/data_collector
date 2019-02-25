# data_collector

This application is a small Web Server Application that uses a Raspberry Pi as accesspoint. This server is connected to FTI devices to collect data. A client is able to connect to the server via a browser and remotely control, collect, download and send FTI device data via email. This SPA (single page application) has both the frontend and backend node.js and Javascript files that generate and modify the HTML.

![alt text](https://github.com/ColinRosati1/data_collector/blob/master/img/scopecollector1.jpg )


The server is run from the Node.js on the Raspberry Pi.

## Getting Started

### Prerequisites
For this application you will need:
```
Raspberry Pi (I have been developing with RPI3 raspbian STRETCH)
Node.js
Additional Device with browser
```
Clone the github repo!
`git clone https://github.com/ColinRosati1/data_collector.git`

#### Access Point
To connect to this application you have two options. The first is done with the Raspberry Pi and client on the same Wifi network. The second option is to setup the RPI to run as an access point. To do this run you can run this [rpi-access-point.sh](https://github.com/ColinRosati1/rpi-access-point) shell script. This script has only been tested on raspbian stretch.

### Server

On the Raspberry Pi run the `server.js` file and or allow RPI to run it on boot. To run on boot use the scope_server.sh file.

`$node server.js`

 If you have enabled RPI access point then connects to Raspberry Pi Wi-Fi network: FTI_SCOPE and open a broswer with`192.168.x.x:8001`.
 otherwise while on the same Wifi network open a broswer and enter`192.168.x.x:8001`. 
 `192.168.x.x` is the IP address of the Raspberry Pi.

The node server builds the front-end HTML static pages receiving an HTTP XHR 'GET' requests and routes all the 'POST' requests to the scope library and web app functionality.

### Using the App
The app is a web app that communicates to FTI boards. It can trigger streaming scope sessions, with detailed index files, timestapping all of this data. 

The client can read the index files on the web browser, download the file from the browser or email the compressed data. 

Here is a [tutorial](https://medium.com/@colin.james.rosati/node-command-line-tool-and-client-server-application-966e49691c57) for earlier version that ellaborates on the node.js program. 


### Author
---
+ **Colin Rosati** | Forstress Technology

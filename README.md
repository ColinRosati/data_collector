# data_collector

Web Server Application that uses a Raspberry Pi as accesspoint Server.

The server is run from the Raspberry Pi terminal from the Node Server.js file

## Getting Started

### ACCESS Point
To allow connect to this application you have the Raspberry Pi and client on the same Wifi network or setup the RPI to run as an access point. To do this run you can run this [rpi-access-point.sh](https://github.com/ColinRosati1/rpi-access-point) shell script. 

### Server

On the Raspberry Pi run the `server.js` file and or allow RPI to run it on boot. 

`$node server.js`

 If you have enabled RPI access point then connects to Raspberry Pi Wi-Fi network: FTI_SCOPE and open a broswer with`192.168.x.x:8001`.
 otherwise while on the same Wifi network open a broswer and enter`192.168.x.x:8001`. 
 `192.168.x.x` is the IP address of the Raspberry Pi.

The node server builds the front-end HTML static pages receiving an HTTP XHR 'GET' requests and routes all the 'POST' requests to the scope library and web app functionality.

### Using the App
The app is a web app that communicates to FTI boards. It can trigger streaming scope sessions, with detailed index files, timestapping all of this data. 

The client can read the index files on the web browser, download the file from the browser or email the compressed data. 

Here is a [tutorial](https://medium.com/@colin.james.rosati/node-command-line-tool-and-client-server-application-966e49691c57) for earlier version that ellaborates on the node.js program. 

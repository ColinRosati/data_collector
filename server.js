// ####################################################################
// server.js 
//		* establishes node server on port : 8001
// 		* XML GET and POST Routes to interface SCOPE calls
//		* reads index data to server the web app
// 
//COMPLETED
// learning HTTP request, response with node server. Learning how to serve static HTML, JS, CSS files. bind client calls to html front end and server routes to make FTI-scope calls from previously built node application. 60 hrs
// sending ZIP folder. explored multiple zip archives. Was challenging to figure out how to send the zip to a browser and have the browser handle. Learning about HTTP browser MIME type handling. This took almost two weeks to figure out. I wasa ble to eventually send single files, then zip folder but was empty, then zip file was corrupted. A lot of my issues was not setting HTTP headers explicitly and the browser hangling translation of the binary stream into UTF string. 
// scope streaming progress bar. parsing Time command and triggering CSS animation from scope streaming call with equation
// ASYNC generating the HTML page. Learning about the order of requests, serving static files
// Writing server routes to handle client HTTP request using Node without other popularly used bloated libraries like express
// populating JSON in HTML table, JSON parse, iterating and generating DOM elements. 12hr
// mobile table view, page views, responsive desining. 2 hrs
// Catching XMLHttpRequest cross-domain errors. Safari network connection was lost
// ####################################################################
const http = require('http');
const fs = require('fs');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//const scope_collector = require('/home/pi/data_collector_access_point/fti_scope_collector.js')
// const Fti_scope = require('/home/pi/data_collector_access_point/fti/lib/fti-scope/scope_collection.js') // 
const Fti_scope = require('./fti/lib/fti-scope/scope_collection.js') // 
const scope_collector = require('./fti_scope_collector.js')
//const index = ('/home/pi/data_collector_access_point/public/index.html')
const index = ('./public/index.html')
//const client = ('/home/pi/data_collector_access_point/public/client.js')
const client = ('./public/client.js')
//const styles = ('/home/pi/data_collector_access_point/public/style.css')
const styles = ('./public/style.css')
//const index_info = ('/home/pi/data_collector_access_point/scope_data/scopedata_index.json')
const index_info = ('./scope_data/scopedata_index.json')
//const data_files = ('/home/pi/data_collector_access_point/scope_data')
const data_files = ('./scope_data')
//const data = ('/home/pi/data_collector_access_point/scope_data/scopedata.txt')
const data = ('./scope_data/scopedata.txt')
const readline = require('readline'); // for keystroke exit
const archiver = require('archiver');
const nodemailer = require('nodemailer');
var exec = require('child_process').exec;
let formBody = ''
let dsp_select = ''
let closer = false

// ####################################################################
// server() Node server & GET, POST routes
// ####################################################################
var server = ()=>{
  console.log('launching server')
    var server = http.createServer(function(request, response) {
    	request.on('error', (err) => {
	      console.error(err.stack);
	    });

	    fs.readFile(index, function (err, html) {
	    	if (err) {
		    	response.writeHead(404)
		    	response.write("File not found")
		        throw err;
		    }

		fs.readFile(client, function (err, clientjs) {
	    	if (err) {
		    	response.writeHead(404)
		    	response.write("File not found")
		        throw err;
		    }

		fs.readFile(styles, function (err, style) {
	    	if (err) {
		    	response.writeHead(404)
		    	response.write("File not found")
		        throw err;
		    }
		    // console.log(request.url)

		    switch(request.method){
		    	case "GET":
		    		if(request.url ==='/'){
		    			response.writeHeader(200, {"Content-Type": "text/html"});
		   			    response.write(html)
		   			    response.end()
		    		}
		    		else if(request.url ==='/302'){
		    			console.log("server redirect")
		    			response.writeHeader(200, {"Content-Type": "text/html"});
		   			    response.write(html)
		   			    response.end()
		    		}
		    		else if(request.url ==='/client.js'){
		    			response.writeHeader(200, {"Content-Type": "text/html"});
		   			    response.write(clientjs)
		   			    response.end()
		    		}
		    		
		    		else if(request.url ==='/style.css'){
		    			response.writeHeader(200, {"Content-Type": "text/css"});
		   			    response.write(style)
		   			    response.end()
		    		}
		    		break;
		    	case "POST":
			    	 if (request.url === '/indexJSON'){
			    		myJSON((data)=>{
			    			console.log('index data table')
			        			response.write(data)
			        			response.end()
			    		})
			    	}
			    	else if (request.url === '/connect'){
			    		let dsp_ip = '';
			    		request.on('data', (data)=>{ // adding chunks of data to request body
			    			dsp_ip += data.toString();
			    		});
			    		request.on('end',(data)=>{
							dsp_select = dsp_ip
							response.end(dsp_ip)
			    		});
			   
			    	}
			    	else if (request.url === '/locator'){
			    		var dspARR = [];
			    		response.writeHead(200, {"Content-Type": "application/json"});
			    		Fti_scope.Locate_button().then(function(thisip) { 
							dspArray = Array.from(thisip)
							if(Array.isArray(dspArray)){
								response.write(JSON.stringify(dspArray));
							};
		        			response.end()
						 });
			    	}

			    	else if (request.url === '/scope'){
			    			request.on('data', (data)=>{ // adding chunks of data to request body
				    			response.write('')
				    			if(data == NaN){
				    				console.log('data is NaN',data )
				    			}
				    			console.log('scope recieves', data);
		    					trigger((state)=>{
				    				response.end(state)
				    				// response.end()
		    					})
		    					 
			    			});
			    	}

			    	else if (request.url === '/scope_end'){
			    		closer = true	
			    		const scope_data = new Fti_scope.scope_collector(dsp_select)
						// scope_data.scope_close()
						scope_data.scope_close()
			    		response.end('Done Streaming')
			    	}

			    	else if (request.url === '/close'){
						setTimeout(()=>{scope_collector.close_web_app()},1000);
						response.write('Close Scope app')
						response.end()
			    	}
			    	else if (request.url === '/scopeform'){
			    		let reqBody = '';
			    		request.on('data', (data)=>{ // adding chunks of data to request body
			    			reqBody += data.toString();
			    			if(reqBody.lenght > 1e7) // max allowance of chunks is 10mb show other response
			    			{
			    				response.writeHead(413, 'Request message too large',{"Content-Type": "text/html"})
			    				response.write('413: server resuest is too big')
			    				response.end()
			    			}
			    		});
			    		request.on('end',(data)=>{
			    			// const scopedata = reqBody
							formBody = reqBody
							response.write(formBody)
			    			response.end()
			    		});
			    	}
			    	else if (request.url === '/reset'){
			    		response.write('Reset Data')
						response.end()
			    		var scope =  scope_collector.reset()
			    	}
			    	else if (request.url === '/download'){
				        archiveZip((data)=>{
							console.log('response callback size	',data.length);
				        	response.setHeader('Content-Type', 'application/zip')
			                response.setHeader('Content-Length', data.length)
			                response.setHeader('Content-disposition', 'attachment; filename="Data.zip"');
			                response.end(data);
				        })
			    	}
			    	else if (request.url === '/email'){
			    		var validEmail, email_Addr = ''

			    		request.on('data', (data)=>{ // adding chunks of data to request body
			    			email_Addr += data.toString();
			    			console.log('server stream email', email_Addr)
			    		});
			    		request.on('end',(data)=>{
							console.log(email_Addr)
							emailData(email_Addr, (valid)=>{
								validEmail = valid
								console.log('email callback',valid)
								if(valid == 1){
					    		    response.end(email_Addr)
					    		}else{
					    			response.end('invalid email')
					    		}
							})
			    		});

			    		// if(validEmail == 1){
			    		//     response.end(email_Addr)
			    		// }else{
			    		// 	response.end('invalid email')
			    		// }
						
			    	}
					else break;
		    }
			})
			})
    	});
    })
    server.listen(8001);
}

// ####################################################################
// myJSON() server returns JSON string to frontend after parsing
// ####################################################################
var myJSON =(callback)=>{
	var obj
	fs.readFile(index_info, function (err, data) {
		let state;
		// let size = fs.statSync(index_info)
		// console.log('size of index',size)
		if(data == 0){
			state = 1;
		}else {
			state = 2;
		}

		switch(state){
			case 1:
				callback('no JSON data available')
				data = {"no index data available":''}
				break;

			case 2:
				const datastr = JSON.stringify(data)
				// JSON.parse("[object Object]")
				// console.log("server parse index bug", datast)
				var newestData = datastr.split("}");
				callback(data)
				return data
				break;
		}
	})
}

// var trigger = async(state)=>{

// }

// ####################################################################
// Trigger() begins Scope streamig 
// // ####################################################################
var trigger = async(callback)=>{
	
	if(dsp_select == ''){
		state = 'server no dsp'
		console.log('state of trigger = ', state)
		callback(state)
	}else{
		new Promise((resolve,reject)=>{
			state = ('Scope Streaming')
			const scope_data = new Fti_scope.scope_collector(dsp_select)
			scope_data.netPollEvent(dsp_select)
			console.log('trigger server dsp',dsp_select, 'formBody', formBody)
			callback(state)
			scope_collector.scope_trigger(formBody,()=>{
				resolve()
				return
			}, dsp_select)
		}).then(()=>{
			console.log('done streaming')
			state = 'done streaming'
			callback(state)
		})
	}
	return 
}

// ####################################################################
// exit_key() closses app
// ####################################################################
var exit_keys=()=>{
		readline.emitKeypressEvents(process.stdin);
	    if (process.stdin.isTTY) {
		    process.stdin.setRawMode(true);
		}
		process.stdin.on('keypress', (str, key) => {
			if(key.sequence === 'q') {
				new Promise((resolve,reject)=>{
					if(resolve){
						resolve(console.log('q signal quiting ...'))
					}else
					reject(console.log("quit promise reject"));
				}).then((results)=>{
					process.exit()
				})
		    }
		    if(key.sequence === 'x') {
		        new Promise((resolve,reject)=>{
					if(resolve){
						resolve(console.log('x signal quiting ...'))
					}else
					reject(console.log("quit promise reject"));
				}).then((results)=>{
					process.exit()
				})
		    }
		    if(key.sequence === '\u0003') {
		       new Promise((resolve,reject)=>{
					if(resolve){
						resolve(console.log('crt+c signal quiting ...'))
					}else
					reject(console.log("quit promise reject"));
				}).then((results)=>{
					process.exit()
				})
		    }
		});
	}

// ####################################################################
// archiveZip() FS read files and write a zipped file
// returns the zipped file.
// zipes a directory with muliple files
// ####################################################################
var archiveZip = (callback) =>{
	var output = fs.createWriteStream(__dirname + '/Data.zip'); //output
	var archive = archiver('zip', {zlib: { level: 9 }}); //can be ZIP or TAR
	output.on('close', function() {
	  console.log(archive.pointer() + ' total bytes');
	  console.log('archiver has been finalized and the output file descriptor has closed.');
	  fs.readFile('./Data.zip', function (err, content) {
	        if (err) {
	            response.writeHead(400, {'Content-type':'text/html'})
	            console.log(err);
	            response.end("No such file");    
	        } else {
	            callback(content);
	        }
	    });
	});
	 
	output.on('end', function() {
	  console.log('Data has been drained');
	});
	 
	archive.on('error', function(err) {
	  throw err;
	});
	archive.pipe(output);
	archive.file(data_files + '/ProdRecBackup.fti', { name: 'ProdRecBackup.fti' });
	archive.file(data_files + '/vdef.json', { name: 'vdef.json' });
	archive.file(data_files + '/parsed_scope.json', { name: 'parsed_scope.json' });
	archive.file(data_files + '/scopedata_index.json', { name: 'scopedata_index.json' });
	archive.file(data_files + '/scopedata.txt', { name: 'scopedata.txt' });
	archive.finalize();
}

// ####################################################################
// dirZip() FS read all files in dir and write a zipped file
// returns the zipped file.
// zips a directory with muliple files
// ####################################################################
var dirZip = (callback) =>{
	var output = fs.createWriteStream(__dirname + '/Data.zip'); //output
	var archive = archiver('zip', {zlib: { level: 9 }}); //can be ZIP or TAR
	output.on('close', function() {
	  console.log(archive.pointer() + ' total bytes');
	  console.log('archiver has been finalized and the output file descriptor has closed.');
	  fs.readFile('./Data.zip', function (err, content) {
	        if (err) {
	            response.writeHead(400, {'Content-type':'text/html'})
	            console.log(err);
	            response.end("No such file");    
	        } else {
	            callback(content);
	        }
	    });
	});
	 
	output.on('end', function() {
	  console.log('Data has been drained');
	});
	 
	archive.on('error', function(err) {
	  throw err;
	});
	archive.pipe(output);
	archive.file(data_files + '/parsed_scope.json', { name: 'parsed_scope.json' });
	archive.file(data_files + '/scopedata_index.json', { name: 'scopedata_index.json' });
	archive.file(data_files + '/scopedata.txt', { name: 'scopedata.txt' });
	archive.finalize();
}

// ####################################################################
// emailData() uses node mailer to send zipped file
// throw callback error if invalid email
// ####################################################################
var emailData=(emailAddr, callback)=>{
	var valid = 1
	let address = ''
	console.log('server emailer recieves', emailAddr)
	if(emailAddr.includes("undefined")){
		address = emailAddr.slice(9);
	}else{ address = emailAddr}

	nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
        host: 'Smtp.live.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        	user: 'scopefti@outlook.com', // generated ethereal user
            pass: 'Ftiscope1' // generated ethereal password
        }
    });

	 fs.readFile("./Data.zip", function (err, data) {
	    let mailOptions = {
	        from: '"Scope FTI 👻" <scopefti@outlook.com>', // sender address
	        sender: 'sender@sender.com',
	        to: address,
	        subject: 'Attachment!',
	        body: 'mail content...',
	        attachments: [{'filename': 'data.zip', 'content': data}]
	    };

	    transporter.sendMail(mailOptions,(err, info)=>{
	        if (err) {
	            console.log("error emailing attachment")
	            valid = 0
	            // return 'invalid email'
	            callback(valid)
	        }
	        if(info){
	        	console.log('Message sent: %s', info.messageId);
	   			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	   			callback(valid)
	        } 
	        else{
	        	console.log('no valid email address or message')
	        	return 'invalid email'
	        	valid = 0
	        	callback(valid)
	        }
	    })
	 });
    });
}

// ####################################################################
// main() begins server
// ####################################################################
var main=()=>{
  console.log('server.js')
  exit_keys()
  server()
}

main();

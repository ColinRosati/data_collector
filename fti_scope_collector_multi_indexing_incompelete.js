// ####################################################################
// data_collector.js uses FTI Flash calls to:
//		* scan available detectors
// 		* log data from scope, log scan
//		* handles commandline arguments : -t time and -m message
//		* creates an index file: scope_data_index.txt to accompany data file: scope_data.txt
//		* Interfaces with the FTI-scope library
// ####################################################################

var d = new Date();
// d.setSeconds(0,0);
var time = d.toISOString()

const fs = require('fs');
const fti = require('./fti/index.js');
const arloc = require('./fti/lib/fti-rpc/arm_find.js');
const NetInterface = require('./fti/lib/fti-rpc/net-interface.js');
const ds = require('./fti/lib/fti-rpc/rpc.js');
const Fti = require('./fti'); 
const path = ('/home/pi/data_collector_access_point/scope_data/scopedata_'+time+'.txt')
const locPath = ("./scope_data/scopedata.txt"); //buffer scope file
const scope_index = ("/home/pi/data_collector_access_point/scope_data/scopedata_index_"+time+".json"); // JSON formated index file
// const scope_index = ("./scope_data/scopedata_index.json"); // JSON formated index file
const readline = require('readline'); // for keystroke exit
const Fti_scope = require('/home/pi/data_collector_access_point/fti/lib/fti-scope/scope_collection.js') // library of SCOPE classes
// const Fti_scope = require('./fti/lib/fti-scope/scope_collection.js') // library of SCOPE classes
const fti_server = require('/home/pi/data_collector_access_point/server.js') // my webapp server
// const fti_server = require('./server.js') // my webapp server
var options = {'flags': 'a', 'encoding': 'binary', 'mode': 0666}; //data writing
var wstream = fs.createWriteStream(path,options)
var start = new Date();
var hrstart = process.hrtime();
let formBody,Customer,Serial,Size = ''
 
// ####################################################################
// index class contains a two writer atributes.
// 1st attribute packet_writer() collects all streaming data and writes hex buffer to file
// 2nd index_writer() writes the index file with line counting
// ####################################################################
class index
{
	constructor(){
		this.index_options = {'flags': 'a', 'encoding': 'utf8', 'mode': '0666'}
	    this.wstream = fs.createWriteStream(scope_index,{'flags': 'a', 'encoding': 'utf8', 'mode': '0666'})
	    this.now = new Date()
		this.child
		var self = this
	}
	packet_writer(data){
	    if(data==0){
	            console.log('no data packet to write')
	            return
	    }

	    var buff = Buffer.from(data);
	    var textChunk = buff.toString('hex');
	    wstream.write(textChunk+'\n');
	    console.log(textChunk)
	    wstream.on('error',()=>{
	    	wstream.end()
	    })
	}

	index_writer(lineCount){
		const data = formBody
		var self = this
		if(lineCount==0){
	            console.log('Error, unable to retreive linecounting data to write')
	            // process.exit()
	            return lineCount = 1
	    }

	    const indexer = new index()
	    let setup = new setup_app
	    let filesize = setup.Filesize(path)
	    console.log("file size", filesize.size)
	    const index_options = this.index_options
	    const wstream = this.wstream
	    const now = new Date()
		let child
		let lines = lineCount
		var sqr

		(()=>{
			console.log("square braket index block 1")
			fs.readFile(scope_index, function (err, data) {
				console.log("square braket index block 2")
				const stats = fs.statSync(scope_index)
				if(stats.size == 0){
					console.log("no data adding first [ to index")
					sqr = '[\n'
					return sqr
				}else {
					sqr = ','
					return sqr
				}
			})
		})()

		new Promise(function(resolve,reject){
			setup.get_line(function(err,  file_line){
		    	if(file_line){
		    		resolve(()=>{
					    var end = new Date() - start,hrend = process.hrtime(hrstart);
					    console.log("##### session run time", hrend[0]/60, 'mins')
					 	var session_lines = file_line - lines;
					 	var session_result = lines + session_lines;
					 	setTimeout(()=>{
					 		var outputJSON = sqr+'{\n  "Time":"'+now +'",\n  "size of '+path+ '": "'+filesize.size+' ",\n  "Customer": "'+Customer+'",\n  "Detector Serial": "'+Serial+'",\n  "Detector Size": "'+Size+'",\n  "Message": "'+formBody+'", \n  "amount of lines before collecting": "'+ lineCount+'",\n  "amount of lines added": "'+ session_lines+'",\n "total lines": "'+file_line+'",\n  "run time": "'+ hrend[0]/60+' mins"\n}\n]';
					 		console.log('##### amount of lines before collecting: '+ lineCount+' adding [ '+session_lines+' ] data lines to in this session of total lines = '+session_result)
			    			fs.readFile(scope_index, function (err, data) {
			    				console.log(data.length - 1, scope_index)
			    				var fd = fs.openSync(scope_index, 'r+');  
							    if (err) {
							        throw 'could not open file: ' + err;
							    }
							    var position = data.length -1
							    console.log('type if data to write', typeof outputJSON, 'poistion',position)
							    fs.write(fd,outputJSON,position,'utf8', function(err) {
							        fs.close(fd, function() {
							            console.log('wrote the file successfully');
							        });
							    });
							});
				    		return file_line
				    	},500)
				    })
			    	return
		    	}
		    	else reject(console.log('cant write index'))
		    	return
		    })
		}).then(function(result){
			result(setTimeout(function(){
				// console.log('index write then complete')
			},1000))
		})
	  
	}

}
class index_old
{
	constructor(){
		this.index_options = {'flags': 'a', 'encoding': 'utf8', 'mode': '0666'}
	    this.wstream = fs.createWriteStream(scope_index,{'flags': 'a', 'encoding': 'utf8', 'mode': '0666'})
	    this.now = new Date()
		this.child
		var self = this
	}
	packet_writer(data){
	    if(data==0){
	            console.log('no data packet to write')
	            return
	    }

	    var buff = Buffer.from(data);
	    var textChunk = buff.toString('hex');
	    wstream.write(textChunk+'\n');
	    console.log(textChunk)
	    wstream.on('error',()=>{
	    	wstream.end()
	    })
	}

	index_writer(lineCount){
		const data = formBody
		var self = this
		if(lineCount==0){
	            console.log('Error, unable to retreive linecounting data to write')
	            // process.exit()
	            return lineCount = 1
	    }

	    const indexer = new index()
	    let setup = new setup_app
	    let filesize = setup.Filesize(path)
	    console.log("file size", filesize.size)
	    const index_options = this.index_options
	    const wstream = this.wstream
	    const now = new Date()
		let child
		let lines = lineCount
		var sqr

		(()=>{
			console.log("square braket index block 1")
			fs.readFile(scope_index, function (err, data) {
				console.log("square braket index block 2")
				const stats = fs.statSync(scope_index)
				if(stats.size == 0){
					console.log("no data adding first [ to index")
					sqr = '[\n'
					return sqr
				}else {
					sqr = ','
					return sqr
				}
			})
		})()

		new Promise(function(resolve,reject){
			setup.get_line(function(err,  file_line){
		    	if(file_line){
		    		resolve(()=>{
					    var end = new Date() - start,hrend = process.hrtime(hrstart);
					    console.log("##### session run time", hrend[0]/60, 'mins')
					 	var session_lines = file_line - lines;
					 	var session_result = lines + session_lines;
					 	setTimeout(()=>{
					 		var outputJSON = sqr+'{\n  "Time":"'+now +'",\n  "size of '+path+ '": "'+filesize.size+' ",\n  "Customer": "'+Customer+'",\n  "Detector Serial": "'+Serial+'",\n  "Detector Size": "'+Size+'",\n  "Message": "'+formBody+'", \n  "amount of lines before collecting": "'+ lineCount+'",\n  "amount of lines added": "'+ session_lines+'",\n "total lines": "'+file_line+'",\n  "run time": "'+ hrend[0]/60+' mins"\n}\n]';
					 		console.log('##### amount of lines before collecting: '+ lineCount+' adding [ '+session_lines+' ] data lines to in this session of total lines = '+session_result)
			    			fs.readFile(scope_index, function (err, data) {
			    				console.log(data.length - 1, scope_index)
			    				var fd = fs.openSync(scope_index, 'r+');  
							    if (err) {
							        throw 'could not open file: ' + err;
							    }
							    var position = data.length -1
							    console.log('type if data to write', typeof outputJSON, 'poistion',position)
							   fs.write(fd,outputJSON,position,'utf8', function(err) {
							        fs.close(fd, function() {
							            console.log('wrote the file successfully');
							        });
							    });
							});
				    		return file_line
				    	},500)
				    })
			    	return
		    	}
		    	else reject(console.log('cant write index'))
		    	return
		    })
		}).then(function(result){
			result(setTimeout(function(){
				// console.log('index write then complete')
			},1000))
		})
	  
	}

}

// ####################################################################
// handles commandline/form parsing for session details
// 1. takes streaming session time
// 2. handles product info
// ####################################################################
class commandline
{
	constructor(lineCount,formTime,formSerial,formSize,formInfo,formCustomer){
		const myArgs = [formTime, formInfo]
		console.log('myArgs from commandline constructor', myArgs)
		formBody = formInfo
		Serial = formSerial
		Size = formSize	
		Customer = formCustomer
		var total_index,i, msg_index, message, Arg_time
		var msg_cmd = {};
		return myArgs
	}

	formInfo(){
		return this.formInfo
	}

	command_args(callback){
		let Arg_time = this.Arg_time
		let myArgs = this.myArgs
		myArgs = process.argv.slice(2)
		// console.log('##### command line arguments = \n',myArgs)

		myArgs.forEach((val, index) => {
			let i = this.i
			i = index
			var msg_cmd = formInfo

			if(val == "--reset"){
				console.log("##### about to erase the all scope data from ", path ,' and ', scope_index)
				setTimeout(function(){
					fs.writeFile(path, ' ', function(){console.log('done erasing conent of ',path)})
					fs.writeFile( scope_index, ' ', function(){console.log('done erasing conent of ',scope_index)})
					console.log('##### done erasing conent ')
					process.exit()
				}, 500)
			}

			if(val == 'formTime'){
			 	Arg_time = formTime
			 	console.log('##### commandline argument rpc stream time =', (Arg_time/60000) +' ( mins )')
			 	return Arg_time;
			 }
		})

		new Promise(function(resolve, reject) {
			const app = new setup_app
			app.get_line(function(err,  file_line){
				if(file_line)
					resolve(file_line)
				else
					reject(console.log("cant get line number")).catch(function(error){ console.log('caught', error.message); })
			})
		}).then(function(result) {
		  console.log("##### amount of data lines in "+ path+ " = ", result); // "Stuff worked!"
		  callback()
		},function(err) {
	  		console.log(err); // Error: "It broke"
		})
	}

}

// ####################################################################
// setup_app class initializes the application :
// Instruction_prompt() logs instructions and file path details 
// Filesize() returns file size
// Packetsize() returns the size of the streaming packet, with a test to make sure all packets are consistent
// Get_line() returns total lines of scope data from scopedata.txt previous sessions
// exit_keys() allows for multiple ways to quit application, keystroke commandline
// ####################################################################
class setup_app{
	constructor(){
	}

	instruction_prompt()
	{
		console.log("##########################\n     Scope Collector\n##########################\n##### Press q, x, ctrl + c to quit\n##### Using the FTI device to begin collecing scope data to "+path);
		console.log("##### Current scope data file "+path);
	}

	Filesize(filename)
	{
		// stats.size / 1000000.0 for megabytes
	    const stats = fs.statSync(path)
	    return stats
	}

	packet_size(callback){
		var packetsize
		let file_lines
		fs.readFile(path, function (err, data) {
			const stats = fs.statSync(path)
				console.log(stats.size)
			if (err) throw err;

			if(stats.size == 0){
				console.log("file empty can't check packet size")
				callback(0)
			}
	  		else{
		  		const lines = data.toString('utf-8').split("\n");
		  		var linepacket = lines[1] 
		  		var packet = linepacket.length
		  		var packetsize = packet + 1
		  		file_lines = lines.length
		  		callback(packetsize)
	  		}
		})
	}

	get_line(callback) {
		this.packet_size((packet)=>{
			// console.log("get line packet size", packet);
			if(isNaN(packet)){
			   callback(null,packet)
			   console.log("packet is not a number", packet);
			   return packet
			}
			else{
			 	const stats = fs.statSync(path)
			    let byteLine = stats.size / packet
		  		if(isNaN(byteLine)){
				   byteLine = '1'
				}
			  	// console.log("packet from get line = ", byteLine);
			  	callback(null, byteLine);
			  	return byteLine
			}
		})
	}

	exit_keys()
	{
		var sc_index = new index()
		readline.emitKeypressEvents(process.stdin);
		const scope_data = new Fti_scope.Scope
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
					scope_data.scope(1000,'quit')
				})
		    }
		    if(key.sequence === 'x') {
		        new Promise((resolve,reject)=>{
					if(resolve){
						resolve(console.log('x signal quiting ...'))
					}else
					reject(console.log("quit promise reject"));
				}).then((results)=>{
					scope_data.scope(1000,'quit')
				})
		    }
		    if(key.sequence === '\u0003') {
		       new Promise((resolve,reject)=>{
					if(resolve){
						resolve(console.log('crt+c signal quiting ...'))
					}else
					reject(console.log("quit promise reject"));
				}).then((results)=>{
					scope_data.scope(1000,'quit')
				})
		    }
		});
	
	}
}

// ####################################################################
// reset() interfaces the webapp to erase all the previous data from files
// ####################################################################
function reset(){
		console.log("##### about to erase the all scope data from ", path ,' and ', scope_index)
		setTimeout(function(){
			fs.writeFile(path, '', function(){console.log('done erasing conent of ',path)})
			fs.writeFile( scope_index, '', function(){console.log('done erasing conent of ',scope_index)})
			console.log('##### done erasing conent ')
			// process.exit()
		}, 500)
}

// ####################################################################
// close_web_app() interfaces the webapp to quit
// ####################################################################
function close_web_app(){
	console.log('quiting web app')
	process.exit()
	}

// ####################################################################
// locateDSP() find DSP boards
// ####################################################################
// async function locateDSP(){
// 	const err = "can't find DSPS"
// 	// console.log("locate dsp fti_scope ")
// 	let myIp = new Promise((resolve, reject) => {
// 	    const scope_data = new Fti_scope.Scope
// 		var dspip = scope_data.Locate_button((ip)=>{
// 			if (myIp) {
// 		      	resolve(ip)
// 		    }else {
// 		    	(reject(err))
// 		    }
// 		})
// 	})

// 	myIp.then((results)=>{
// 		// console.log('DSP ip ',results)
// 		return results
// 	})
//     return await myIp
// }

// ####################################################################
// scope trigger() is the interface to the webapp that executes all the scope collection
// once application resolve environment data (get_line) then calls scope call from main library
// ####################################################################
var scope_trigger = async(data, callback, dsp)=>{
	if(data){
		console.log('scope trigger dspip ', dsp)
		console.log('trigger back end recieves raw = ',data)
		let dataparse = JSON.parse(data)
		console.log('trigger parsed data = ',dataparse)
		let lines;
		let key = Object.keys(dataparse)[1];
		let state = false
		value = dataparse[key]
		// console.log(key,value, dataparse);
		let formTime = ''
		console.log('value of form time without input', dataparse.time)
		if(!dataparse.time ){
			console.log('no time for scope')
			formTime = 10000
		}else{
			formTime = dataparse.time
		}
		const formSerial = dataparse.detector_serial
		const formSize = dataparse.detector_size
		const formInfo = dataparse.info
		const formCust = dataparse.customer
		console.log( 'Customer ',formCust,'Detector Serial ',formSerial,'Detector Size ',formSize, ' info', formInfo ,'my form time',formTime)
		const setup = new setup_app();
		setup.exit_keys()
		setup.instruction_prompt()


		let _lines = async(lines)=>{
			const command = new commandline(lineCount, formTime, formSerial, formSize, formInfo, formCust)
			const scope_data = new Fti_scope.Scope(dsp)
			// return scope_data.Fti_Locate(()=>{
				// console.log('_lines line', lines)
				scope_data.scope(formTime,lines, callback)
			// })
		}

		var lineCount = new Promise(function(resolve, reject) {
			setup.get_line(function(err,  file_line){
				if(file_line){
					// console.log("lineCount ", file_line)
					resolve(file_line)
				}
			})
		}).then((result)=>{
			// console.log('promise lines result',result)
			// console.log("_lines(result,callback(state)) returns",_lines(result))
			_lines(result)
			return result
		},(err)=>{console.log(err);})
	}else{
		var err = "no DSP data input"
		console.log("no DSP data input")
		callback(err)
		return ("no DSP data input")
	}
	
}	


// ####################################################################
// main() is unused. scope_trigger() replaces the need for its use
// ####################################################################
// function main() {
// 	const scope_data = new Fti_scope.Scope
// 	const setup = new setup_app();
// 	setup.exit_keys()
// 	setup.instruction_prompt()

// 	var lineCount = new Promise(function(resolve, reject) {
// 		let setup = new setup_app
// 		setup.get_line(function(err,  file_line){
// 			if(file_line){resolve(file_line)}
// 			else{reject(console.log("err")).catch(function(error){ console.log('caught', error.message); })}
// 		})
// 	}).then(function(result){(result)},function(err) {console.log(err);})

// 	var command = new commandline(lineCount)
// 	command.command_args(()=>{
// 		setTimeout(function(){
// 			console.log("##### press button to begin ...")
// 			// scope_data.Fti_Locate(()=>{
// 			// 	scope_data.scope(command.time_arg(),()=>{})
// 			// })
// 		},100);
// 	})
// }

// ####################################################################
// exit closes everything
// ####################################################################
function exit()
{
	console.log('##### exiting ...')
	const exit = new Promise(function(resolve,reject){
			if(wstream){
				resolve(function(){
					wstream.end();
				})
			}
			else{
				reject(console.log("reject exit ")).catch(function(error){ console.log('caught', error.message);})
			}
		})

		exit.then(function(result){
				result(setTimeout(function(){
					setTimeout(function(){process.exit()},1000)
				},1000))
		},function(err){
			console.log(err)
		})
}

module.exports.index = index
module.exports.setup_app = setup_app;
module.exports.scope_trigger = scope_trigger;
module.exports.close_web_app = close_web_app;
module.exports.reset = reset;

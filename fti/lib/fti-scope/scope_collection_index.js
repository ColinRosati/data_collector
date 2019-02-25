// // ####################################################################
// // writer() writes data to file
// // ####################################################################
// function writer(data)
// {
//     if(data==0){
//             console.log('no data to write')
//             return
//     }

//     var buff = Buffer.from(data);
//     var textChunk = buff.toString('hex');
//     wstream.write(textChunk+'\n');
// }

// // ####################################################################
// // index class contains a writer object and linesession object
// // Handles index writing for twow different application to write data to file
// // ####################################################################
// class index
// {
// 	constructor(data){
// 		this.data = data
// 		this.index_options = {'flags': 'a', 'encoding': 'utf8', 'mode': '0666'}
// 	    this.wstream = fs.createWriteStream(scope_index,{'flags': 'a', 'encoding': 'utf8', 'mode': '0666'})
// 	    this.now = new Date()
// 	    this.filesize = Filesize(path)
// 		this.child
// 	}

// 	writer(){
// 		const data = this.data
// 		if(data==0){
// 	            console.log('no data to write')
// 	            return
// 	    }
	    
// 	    const index_options = this.index_options
// 	    const wstream = this.wstream
// 	    const now = new Date()
// 	    const filesize = this.filesize
// 		let child
		
// 	    get_line(function(err,  file_line){
// 	    	if(file_line){
// 		    	console.log('##### amount of lines from index_writer()= '+ file_line);
// 		    	wstream.write(now +'{\n    [ '+path+ ' = '+filesize+' mg ]\n    [ '+data+' ]\n'); 
// 		    	return file_line
// 	    	}
// 	    	else console.log('cant get_line()')
// 	    })
// 	}

//     linesession(){
//     	const index_options = this.index_options
// 	    const wstream = this.wstream

// 	    var old_lines = global_old_lines.then(function(result) {
// 			  return result
// 			},function(err) {
// 		  		console.log(err); // Error: "It broke"
// 		})

//         get_line(function(err,  file_line){
//       	     global_old_lines.then(function(result) {

//       	     	setTimeout(function (argument) {
// 				    var end = new Date() - start,
// 				        hrend = process.hrtime(hrstart);
				    
// 				    console.log("##### session run time", hrend[0]/60, 'mins')
					
// 				 	var session_lines =file_line - result;
// 				 	var session_result = result + session_lines
// 				 	if( session_lines > 0){
// 				 		console.log('##### adding [ '+session_lines+' ] data lines to in this session of total lines = '+result)
// 				 		wstream.write('    [ amount of lines before collecting = '+ result+' ]\n    [ amount of lines added = '+ session_lines+' total lines = '+file_line+' ]\n    [ run time = '+ hrend[0]/60+' mins}\n\n'); 
// 		    			return file_line
// 				 	}
// 				 	else {
// 				 		(console.log("no scope data added to session")) 
// 				 		return
// 				 	}
// 				 	return
// 			 	}, 1);
// 	    	})
//       	    global_old_lines.catch(function(error){ 
// 			console.log('caught', error.message); 
// 		})
// 		},function(err) {
// 	  		console.log(err); // Error: "It broke"
// 		})
// 		return
// 	}
// }

// // ####################################################################
// // handles commandline message args
// // ####################################################################
// function msg_arg(callback){
// 	var myArgs = process.argv.slice(2);
// 	var msg_cmd= {};
// 	var total_index,i, msg_index, message
// 	function e(message){
// 		var message = process.argv.slice(msg_index)
// 		return message
// 	}

// 	process.argv.forEach((val, index) => {
// 		i = index
// 		msg_cmd[i] = val
// 		if(val == "-m"){
// 			msg_index = index
// 		}

// 		if(val == "--reset"){
// 			console.log("about to erase the all scope data from ", path ,' and ', scope_index)
// 			setTimeout(function(){
// 				fs.truncate(path, 0, function(){console.log('done erasing content of ',path)})
// 				fs.truncate( scope_index, 0, function(){console.log('done erasing conetnt of ',scope_index)})
// 			}, 5000)
// 		}
// 	})

// 	total_index = i
// 	message = e()
// 	var ixwr = new Promise(function(resolve,reject){
// 		const indexer = new index(message)
// 		if(index){
// 			resolve(indexer.writer())
// 		}
// 		else{
// 			reject(console.log('cant write index')).catch(function(error){ console.log('caught', error.message); })
// 		}
// 	})

// 	ixwr.then(function(result){
// 		if(callback){callback()}
// 		else{console.log('no callback')}
// 	}, function(err){
// 		console.log('err', err)
// 	})
// 	console.log("##### your command message  ", message )
// 	if(callback){callback()}
// 	else{console.log('no callback')}
// }

// // ####################################################################
// // handles commandline args
// // ####################################################################
// function command_args(callback){
// 	var myArgs = process.argv.slice(2);
// 	var msg_cmd= {};
// 	var total_index,i, msg_index, message
// 	function e(message){
// 				var message = process.argv.slice(msg_index)
// 				return message
// 			}

// 	process.argv.forEach((val, index) => {
// 		i = index
// 		msg_cmd[i] = val
// 		if(val == "-m"){
// 			msg_index = index
// 		}
// 		if(val == "--reset"){
// 			console.log("##### about to erase the all scope data from ", path ,' and ', scope_index)
// 			setTimeout(function(){
// 				fs.writeFile(path, '', function(){console.log('done erasing conent of ',path)})
// 				fs.writeFile( scope_index, '', function(){console.log('done erasing conent of ',scope_index)})
// 				console.log('##### done erasing conent ')
// 				process.exit()
// 			}, 5000)
// 		}
// 	})

// 	message = e()
// 	console.log("##### commanline arguments ", message)

// 	process.argv.forEach((val, index) => {
// 	 if(val == '-t'){
// 	 	var timeArg = index
// 	 	var timeIndex = timeArg - 1;
// 	 	Arg_time = myArgs[timeIndex]
// 	 	// if(Arg_time >=)
// 	 	console.log('##### commandline argument rpc stream time =', (Arg_time/60000) +' ( mins )')
// 	 	return Arg_time;
// 	 }
// 	return Arg_time;
// 	});

// 	var index_msg = [message, Arg_time]
	
// 	new Promise(function(resolve, reject) {
// 		get_line(function(err,  file_line){
// 			if(file_line)
// 				resolve(file_line)
// 			else
// 				reject(console.log("cant get line number")).catch(function(error){ console.log('caught', error.message); })
// 		})
// 	}).then(function(result) {
// 	  console.log("##### amount of data lines in "+ path+ " = ", result); // "Stuff worked!"
// 	},function(err) {
//   		console.log(err); // Error: "It broke"
// 	})

// 	var ixwr = new Promise(function(resolve,reject){
// 		const indexer = new index(message)
// 		if(index){
// 			resolve(indexer.writer())
// 		}
// 		else{
// 			reject(console.log('cant write index')).catch(function(error){ console.log('caught', error.message); })
// 		}
// 	}).then(function(result){
// 		if(callback){callback()}
// 		else{console.log('no callback')}
// 	}, function(err){
// 		console.log('err', err)
// 	})
// }

// // ####################################################################
// // handles commandline time arg
// // ####################################################################
// function time_arg(callback, time){
// 	var myArgs = process.argv.slice(2);
// 	process.argv.forEach((val, index) => {
// 	 if(val == '-t'){
// 	 	var timeArg = index
// 	 	var timeIndex = timeArg - 1;
// 	 	Arg_time = myArgs[timeIndex]
// 	 	// console.log('arg time', Arg_time)
// 	 	return Arg_time;
// 	 }
// 	});

// 	setTimeout(function(){
// 		callback()
// 		time = Arg_time;
// 		return time
// 	},Arg_time);
// 	return Arg_time
// }

// // ####################################################################
// // Locates and logs Arm scope data
// // ####################################################################
// function Fti_Locate(callback){
// 	'use strict'
// 	var Arm_Array = [];
// 	arloc.ArmLocator.scan(1,function(list){
// 		console.log('##### device : ' + list);
// 		callback()
// 	});
// 	return;
// }

// // ####################################################################
// // lists instruction
// // ####################################################################
// function intruction_prompt(callback){
// 	console.log("##########################\n     Scope Collector\n##########################\n##### Press q, x, ctrl + c to quit\n##### Using the FTI device to begin collecing scope data to "+path);
// 	console.log("##### scope data file ("+path+ ') is '+Filesize(path)+' mg ');
// 	callback();
// }


// // ####################################################################
// // main
// // ####################################################################
// function main() {
//     intruction_prompt(function(){
// 		const commands = new Promise(function(resolve,reject){
// 			if(resolve){
// 				resolve(command_args(function(){}));
// 			}
// 			else reject(console.log('unable to log process arugments'))
// 		})
// 		commands.then(
// 			Fti_Locate(function(){
// 					Fti_Scope()
// 			})
// 		)
//     });
//     exit_keys();
// }

// // ####################################################################
// // filesize() returns file size in mg
// // ####################################################################
// function Filesize(filename) {
//     const stats = fs.statSync(path)
//     const fileSizeMG = stats.size / 1000000.0
//     return fileSizeMG
// }

// // ####################################################################
// // get line() reads a line from data file
// // Data is a buffer that we need to convert to a string
// // Improvement: loop over the buffer and stop when the line is reached
// // ####################################################################
// function get_line(callback) {
// 	let file_lines
// 	fs.readFile(path, function (err, data) {
//   		if (err) throw err;
//   		const lines = data.toString('utf-8').split("\n");
//   		file_lines = lines.length
//   		callback(null, file_lines);
// 	})
// }

// // ####################################################################
// // line_session() calculates amount of data written to data file in script session
// // ####################################################################
// function line_session() {
//     return fs.readFile(path, function (err, data) {
//       if (err) throw err;

//       var old_lines = global_old_lines.then(function(result) {
// 		  return result
// 		},function(err) {
// 	  		console.log(err); // Error: "It broke"
// 		})

//       get_line(function(err,  file_line){
//       	var old_lines = global_old_lines.then(function(result) {
// 		  var session_lines =file_line - result;
//       	  // console.log('amount of lines logged to '+path+ ' amount of lines added = '+ session_lines + 'old lines = ', result)
//       	  index.writer(session_lines)
// 		},function(err) {
// 	  		console.log(err); // Error: "It broke"
// 		})
//     	return file_line
//    	  })
//     })   
// }

// // ####################################################################
// // stream_indexer()
// // Creates a indexer promise to index data or exit
// // ####################################################################
// function stream_indexer(){
// 	const stream = new Promise(function(resolve,reject){
// 		if(resolve){
// 		resolve(function(){
// 			const indexer = new index()
// 			if(indexer){
// 				indexer.linesession()
// 			}
// 			else {
// 				console.log('unable to calculate lines of data') 
// 			}
// 		})
// 		}
// 		else{
// 			reject(console.log("no stream rpc")).catch(function(error){ 
// 				console.log('caught', error.message); 
// 			})
// 		}
// 	})
// 	stream.then(function(result){
// 			result(setTimeout(function(){
// 				exit()
// 			},1000))
// 	},function(err){
// 		console.log(err)
// 	})
// 	stream.catch(function(error){ 
// 		console.log('caught', error.message); 
// 	})
// }		

// // ####################################################################
// // exit closes everything via keystroke
// // keystroke handled q, ctrl + c
// // ####################################################################
// function exit_keys()
// {
// 	readline.emitKeypressEvents(process.stdin);
//     process.stdin.setRawMode(true);
// 	process.stdin.on('keypress', (str, key) => {
// 		if(key.sequence === 'q') {
// 			console.log('quiting ...')
// 	        setTimeout(function(){process.exit()},1000);
// 	    }
// 	    if(key.sequence === 'x') {
// 	        console.log('quiting ...')
// 	        setTimeout(function(){process.exit()},1000);
// 	    }
// 	    if(key.sequence === '\u0003') {
// 	        console.log('quiting ...')
// 	        setTimeout(function(){process.exit()},1000);
// 	    }
// 	});
// }

// // ####################################################################
// // exit_cb closes everything
// // ####################################################################
// function exit()
// {
// 	console.log('##### exiting ...')
// 	const exit = new Promise(function(resolve,reject){
// 			if(wstream){
// 				resolve(function(){
// 					wstream.end('This is the end\n');
// 				})
// 			}
// 			else{
// 				reject(console.log("reject exit ")).catch(function(error){ console.log('caught', error.message);})
// 			}
// 		})

// 		exit.then(function(result){
// 				result(setTimeout(function(){
// 					setTimeout(function(){process.exit()},1000)
// 				},1000))
// 		},function(err){
// 			console.log(err)
// 		})
// }
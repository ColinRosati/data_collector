	//####################################################################
	//Parse_scope_data.js
	//
	// parses scope data from scopedatafile.txt that data_collector.js makes
	// spits out a formatted JSON object that can is indexed and can be plotted, modified
	//
	// ####################################################################
	var fs = require('fs'); // this is necassery to read and write
	var es = require('event-stream'); // event stream for pausing stopping stream
	var stream = require('stream')
	var read_file = './scope_data/scopedata.txt';
	var wr_file = './scope_data/parsed_scope.json';
	var lineReader = require('line-reader');
	var wstream = fs.createWriteStream(wr_file,{flags:'a'})	

	function parseHexString(str) {
	    var result = [];
	    while (str.length >= 2) {
	        result.push(parseInt(str.substring(0, 2), 16));
	        str = str.substring(2, str.length);
	    }
	    parse_scope_data(result)
	    return result;
	}

	function parse_scope_data(buf){
		if(buf == 0){
			throw error('no scope data');
		}
		var self = this;

		var unit = 255
		var count_base = buf[2] * unit

		var count = buf[1] + count_base
		var log_in = [buf[3],buf[4],buf[5],buf[6]];
		var log_out = [buf[7],buf[8],buf[9],buf[10]];
		var r = [buf[11],buf[12]];
		var x = [buf[13],buf[14]];
		var phaseR = [buf[15],buf[16]];
		var phaseX = [buf[17],buf[18]];
		var sig_norm = buf[19,20];

		var rx_data = {
		   sig: [buf[0]],
		   count: [count],
		   log_in:    log_in,
		   log_out:   log_out,
		   r: 		  r,
		   x: 		  x,
		   phaseR:    phaseR,
		   phaseX:    phaseX,
		   sig_norm:  sig_norm 
		};

		var scope_data = JSON.stringify(rx_data);
        writer(scope_data)
	}

	// ####################################################################
	// writer() writes data to file in JSON
	// ####################################################################
	function writer(data)
	{
		if(data==0){
			console.log('no data to write')
			return
		}
		// console.log('writing')
		console.log( data );
		
		// function e (){
			wstream.write(data+'\n'); 
			// console.log('Complete parsing');
		// };
	}

	function main(){
		console.log('begin translating ...');
		lineReader.eachLine(read_file, function(line, last) {
		  parseHexString(line);
		});
	}
  	
main()
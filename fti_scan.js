// ####################################################################
// fti_scan.js uses FTI Flash calls to:
//		* scan available detectors
// 		* log data into datafile.txt

// ####################################################################
var fs = require('fs');
var fti = require('./fti/index.js');  // move all requires up top
var arloc = require('./fti/lib/fti-rpc/arm_find.js');
var BufferPack = require('bufferpack');
var NetInterface = require('./fti/lib/fti-rpc/net-interface.js');
var ds = require('./fti/lib/fti-rpc/rpc.js');
var Fti = require('./fti');
var sys = require('util')
var exec = require('child_process').exec;
var child;
var path = ("/scope_data/datafile.txt");
const readline = require('readline');
 
// ####################################################################
// exit closes everything
// pins?
// keystroke handled q, ctrl + c
// ####################################################################
function exit()
{
	readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
	process.stdin.on('keypress', (str, key) => {
		if(key.sequence === 'q') {
	        process.exit();
	    }
	    if(key.sequence === 'x') {
	        process.exit();
	    }
	    if(key.sequence === '\u0003') {
	        process.exit();
	    }  
	});
}

// ####################################################################
// lists instruction
// ####################################################################
function intruction_prompt(){
	console.log("####################\n Fti_Scan \n####################\n## Press q, x, ctrl + c to quit\n## Scans available FTI Devices \n## \n## begin ... \n" );
}

// ####################################################################
// main()
// ####################################################################
function main() {
	intruction_prompt(function(){
s	});
    exit();
	Fti_Locate();  
}

// ####################################################################
// writer() writes data to file
//async method nesting the file writing function inside of this function
//must nest callback in order for stack to move out of scope
// ####################################################################
function writer(Obj_Type,data, DataSize)
{
	var netinfo= [];
	child = exec("date", function (error, stdout) {
	  fs.appendFile(path,'\n'+stdout+Obj_Type+'\n'+netinfo+'}'+'\n',function(err){});
	   if (error !== null) {
	    console.log('exec error: ' + error);
	    return;
	  }
	});
}

// ####################################################################
// Locats and logs Arm scope data
// ####################################################################
function Fti_Locate(){
	'use strict'
	var Arm_Array = [];
	arloc.ArmLocator.scan(2500,function(list){
		var mylist= [JSON.stringify(list)];
		mylist.forEach(function(item) {
		  Arm_Array.push(item)
		});
	});
	setTimeout(function(e){
		writer(JSON.stringify(Arm_Array));
		console.log(Arm_Array);
		return
	},2000)

	// setTimeout(function(){ process.exit()}, 5000);
}

// // ####################################################################
// // GPIO closes pins
// // ####################################################################
// function exit_gpio()
// {
// 	// This is from another library but you need to find how to unexport form this GPIO closure
// 	wpi.teardown(10, function(){
// 	});
// 	wpi.teardown(11, function(){
// 	});
// 	wpi.teardown(40, function(){
// 	});
// }

main();

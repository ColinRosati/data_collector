// ####################################################################
// data_collector.js uses FTI Flash calls to:
//		* scan available detectors
// 		* log data from scope, log scan
//		* handles commandline arguments : -t time and -m message
//		* creates an index file: scope_data_index.txt to accompany data file: scope_data.txt
// ####################################################################

const fs = require('fs');
const util = require('util');
const stream = require('stream');
const tftp = require('tftp');
const fti = require('../../index.js');
const arloc = require('../../lib/fti-rpc/arm_find.js');
const BufferPack = require('bufferpack').Buffer;
const zlib = require('zlib')
// const buffer = require('buffer').Buffer;
const NetInterface = require('../../lib/fti-rpc/net-interface.js');
const Rpc = require('../../lib/fti-rpc/rpc.js');
const arm_rpc = require('../../lib/fti-rpc/arm_rpc.js')
const Fti = require('../../../fti');
const fti_scope_collector = require('../../../fti_scope_collector.js');
const fti_server = require('../../../server.js') // my webapp server
const sys = require('util')
const exec = require('child_process').exec;
const dgram = require('dgram');
const path = ("../../../scope_data");
const scope_index = ("../../../scope_data/scopedata_index.txt");
const readline = require('readline');

var options = {'flags': 'a', 'encoding': 'binary', 'mode': 0666};
var wstream = fs.createWriteStream(path,options)
var startTime = Math.floor(Date.now() / 1000);
var Arg_time
const secTimeout = 2000;
const HALO_TEST_DELAY = 1;
const DSP_SCOPE_PORT = 10004;
const KERN_API_RPC = 19;
const KAPI_RPC_TEST = 32;
const KAPI_IBTEST_PASSES_FE_READ = 210
const KAPI_IBTEST_PASSES_NFE_READ = 214
const KAPI_IBTEST_PASSES_SS_READ = 218
const KAPI_IBTEST_PASSES_FE_WRITE = 90//212
const KAPI_IBTEST_PASSES_NFE_WRITE = 94
const KAPI_IBTEST_PASSES_SS_WRITE = 98
const NP_RPC = 13
const KAPI_RPC_ETHERNETIP = 100;
const KAPI_RPC_REJ_DEL_CLOCK_READ = 70;
const DRPC_NUMBER = 19;
var myDspIp =''
var file_line = ''

var start , hrstart 

// ####################################################################
// scope collector class initializes, triggers RPCs and locates ip address
// ####################################################################
class scope_collector {
	constructor(ip,port){
		myDspIp = ip // this is the external IP address of the DSP
		var FtiRpc = Rpc.FtiRpc;
	    var arm = new arm_rpc.ArmRpc(myDspIp);
	    var ph, time;
	    var packetHandler = ph;
	    var port = port
	   	var dsp = FtiRpc.udp(myDspIp);
	    this.port = port
	    this.ip = myDspIp;
	    this.arm = arm
	    this.dsp = dsp
	}


	scope(time_arg_cb, lineCount, callback){
		var dspip = this.ip
		var FtiRpc = Rpc.FtiRpc;
	    var arm = new arm_rpc.ArmRpc(dspip);
	    var ph, time;
	    var packetHandler = ph;
	    var self = this;
	    this.port = this.port
	    this.ip = dspip;
	    this.dsp = this.dsp
	    file_line = lineCount

	    start = new Date()
		hrstart = process.hrtime()

	    async function aScope(acallback){
	    	console.log('currently using dsp ip ', dspip)
	    	arm.echo_cb(function(array){
		      arm.dsp_open_cb(function(pl){
	        	self.bindSo(dspip,time_arg_cb,file_line,function(){
	        		self.bindNP(dspip,()=>{
	        			self.rpc_stream(time_arg_cb,function(){
	        			});
	        		})
		        },callback);
		      });
		    });
	    }
	    aScope()
	    
    }

	Fti_Locate(callback){
		'use strict'
		var Arm_Array = [];
		arloc.ArmLocator.scan(1,function(list){
			console.log('##### device : ' + list);
			callback(list)
		});
		return;
	}

	scope_close(){
		console.log('scope_close() from scope_collection.js')
		var dspip = this.ip
		var FtiRpc = Rpc.FtiRpc;
	    var arm = new arm_rpc.ArmRpc(dspip);
	    var self = this;
	    let setup = new fti_scope_collector.setup_app
	    let lines = setup.get_line(function(err,  file_line){
	    	self.rpc_stream_end(()=>{
		    	var so = dgram.createSocket({type: 'udp4', reuseAddr: true})

		    	so.on('listening',()=>{
		    	})
		    	so.close()

		    	so.on('close',()=>{
		    		so.unref()
		    		var sc_index = new fti_scope_collector.index
		    		console.log("lines end ", file_line)
		    		console.log("this is my scope_close from scope_collection.js being passed into index_writer =", start, hrstart)
					sc_index.index_writer(file_line, start , hrstart )
		    	})
				
		    })
	    	return file_line
	    })
	    
	}

	stream_end_check(){
		var dspip = this.ip
		var FtiRpc = Rpc.FtiRpc;
	    var arm = new arm_rpc.ArmRpc(dspip);
	    var self = this;
	    let setup = new fti_scope_collector.setup_app
	    let lines = setup.get_line(function(err,  file_line){
		    	var so = dgram.createSocket({type: 'udp4', reuseAddr: true})
		    	so.on('listening',()=>{
		    	})
		    	so.close()

		    	so.on('close',()=>{
		    		so.unref()
		    	})
				
	    	return file_line
	    })
	    
	}

	bindSo(ip,time_arg_cb,lineCount, callback, end_cb){
	    var self = this;
	    var dsp = this.dsp;
	    var so = dgram.createSocket({type: 'udp4', reuseAddr: true})
	    var sc_index = new fti_scope_collector.index
	    var lines = lineCount
	    // console.log('bind socket stream time', time_arg_cb)
	     var packetHandler = function(e){sc_index.packet_writer(e)}

	    so.on('error', function(err) {
	    	if (err){
	    		console.log('error socket')
	    	}
		  console.log(`server error:\n${err.stack}`);
		  so.close();
		});

		so.bind(DSP_SCOPE_PORT,'0.0.0.0', function(){
	      console.log("socket bound from scope collection.js")
	    })

	    so.setMaxListeners(201)
	    // so.setMaxListeners(500001)

		so.on('message', function(e,rinfo){
	        if(e){
	            packetHandler(e)
			}
			else{
				so.close()
				so.unref()
			}
			return

		});

		so.on('close', ()=>{
			// self.rpc_stream_end(()=>{})
			setTimeout(function(){
				var sc_index = new fti_scope_collector.index
				sc_index.index_writer(lines, start, hrstart)
				end_cb('done streaming')
			},1050)
		})

		callback()

		// this closes the socket
		setTimeout(function(){
			// self.rpc_stream_end(()=>{})
			so.close()
		}, ((time_arg_cb * 1000))); //convert end time into millisecond and some to finish up streaming catch last packets
	}

  	bindNP(ip, callback){
	    console.log('binding net poll')
	    var self = this;
	    var port = this.port
	    var dsp = this.dsp;
	    var dspip = this.ip;
	    var np = dgram.createSocket({type: 'udp4', reuseAddr: true})
	    var ra =[]
		var xa =[]
		var idx

	    np.on('error', function(err) {
		  console.log(`server error:\n${err.stack}`);
		  np.close();
		});

		// np.setMaxListeners()

	    np.on("listening", function () {
	    	self.getVdef(dspip,function(ip){
		  		console.log("failed to get vdef from ", ip)
			})
			// self.init_net_poll_events(np.address().port);
	    });

	    np.on('message', function(e,rinfo){
	      if(self.state.dspip == rinfo.address){
	        if(e){
	          self.parse_net_poll_event(e);
	        }
	        e = null;
	        rinfo = null;
	      }
	    });

	    // e}np.bind(DSP_SCOPE_PORT,'0.0.0.0',{address: '0.0.0.0',port: 0,exclusive: tru) //mabye need this, wahts it binding to?
	    np.bind({address: '0.0.0.0',port: 0,exclusive: true});

		callback()

		np.on('close', function(){
			console.log('closing')
			np.unref();
		});
	}

	netPollEvent(){
	    console.log('binding net poll')
	    var self = this;
	    var port = this.port
	    var dsp = this.dsp;
	    var dspip = this.ip;
	    var np = dgram.createSocket({type: 'udp4', reuseAddr: true})
	    var ra =[]
		var xa =[]
		var idx

	    np.on('error', function(err) {
		  console.log(`server error:\n${err.stack}`);
		  np.close();
		});

	    np.on("listening", function () {
			self.init_net_poll_events(np.address().port);
	    });

	    np.on('message', function(e,rinfo){
	      if(self.state.dspip == rinfo.address){
	        if(e){
	          self.parse_net_poll_event(e);
	        }
	        e = null;
	        rinfo = null;
	      }
	    });

	    np.bind({address: '0.0.0.0',port: 0,exclusive: true});

		// callback()

		np.on('close', function(){
			console.log('closing')
			np.unref();
		});
	}

   getVdef(ip,failed){
	  var tclient = tftp.createClient({host:ip ,retries:10, timeout:1000})
	  console.log('getting vdef from ' + ip)
	  var get = tclient.createGetStream('/flash/vdef.json')
	      var rawVdef = [];
	      get.on('data', (chnk)=>{
	        rawVdef.push(chnk)//zlib.gunzipSync(chnk);
	        chnk = null;
	      })
	      get.on('end', ()=>{
	      console.log('getting vdef tftp end')
	      console.log(ip)
	      var buffer = Buffer.concat(rawVdef)
	      zlib.unzip(buffer, function(er,b){
	        var vdef = JSON.parse(b.toString())

	        new Promise((resolve,reject)=>{
	        	fs.writeFile('scope_data/vdef.json', '', (err) => {  // create file if none existent before writing to it
			  		if (err) throw err;
					resolve()
				})

	        }).then(()=>{
	        	var fd = fs.openSync('scope_data/vdef.json', 'r+');
				fs.write(fd,b.toString(),0,'utf8', function(err) {
		        	fs.close(fd, function() {
		            	console.log('wrote the file successfully');
		        	});
		    	}
		    )})
	        get.abort()
	      })

	      rawVdef = null;
	      buffer = null;

	    })
	     get.on('error',(e)=>{
	        console.log(e)
	        rawVdef = null;
	        tclient = null;
	        failed(ip);
	      })

	}

	get_prod_rec(ip,failed){
	  var tclient = tftp.createClient({host:ip ,retries:10, timeout:500})
	  console.log('getting product record from ' + ip)
	  const ProdRec = ("scope_data/ProdRecBackup.fti");

	  	getFileTftp(ip,'/FTIFiles/ProdRecBackup.fti', ProdRec,function(){
	     			console.log('ProdRecBackup transfered')
	        },function(e){
	          console.log('Products Backed error')
	          failed(ip);
	        })
	}

  init_net_poll_events(port){
    var self = this;
    var dsp = this.dsp;
    var dspip = this.ip
    var arm = new arm_rpc.ArmRpc(dspip);

    dsp.rpc1(19,[100,port], "",1.0, function(e, r){
   	   console.log('net poll bound')
   	   self.getVdef(dspip,function(ip){
	  		console.log("failed to get vdef from ", ip)
		})

  	    arm.rpc_cb([1,6],function(e){
  	    	self.get_prod_rec(dspip,function(ip){
		  		console.log("failed to get vdef from ", ip)
			})
	    })
    });
  }




  parse_net_poll_event(buf){
  	 console.log('Parse net poll event')
    var key = buf.readUInt16LE(0);
    var res = "";
    var self = this;
    console.log("packet received: " + buf.toString('hex'));
//    console.log("Key: " + "0x" + key.toString(16));
    var value = buf.readUInt16LE(2);

    if(49152 == (key & 0xf000)){// && ((e=="NET_POLL_PROD_SYS_VAR") || (e=="NET_POLL_PROD_REC_VAR")))
        console.log('PROD_REC_VAR')
        console.log(buf.slice(9).toString())

     }else if(32768 == (key & 0xf000)){
        console.log('PROD_SYS_VAR')
        console.log(buf.slice(9))

     }

  }
  askForRec(){
    var dsp = this.dsp;
    dsp.rpc1(19,[100], "",1.0, function(e, r){
      console.log(e,r)
    })

  }

  setHaloParams(f,n,s, callBack){
    console.log(f)
    var dsp = this.dsp;

    dsp.rpc1(KERN_API_RPC, [KAPI_IBTEST_PASSES_SS_WRITE, s], "",1.0, function(){
        console.log('SS set');
        dsp.rpc1(KERN_API_RPC, [KAPI_IBTEST_PASSES_FE_WRITE, f], "",1.0, function(){
          console.log("FE set")
          dsp.rpc1(KERN_API_RPC, [KAPI_IBTEST_PASSES_NFE_WRITE, n], "",1.0, function(){
            console.log("NFE set")
            if(callBack){
              callBack();
            }
          })
        })
      });
  }

  haloTest(t){
    console.log("halo test #",t," begin")
    var dsp = this.dsp;
    if(t == 0){
       dsp.rpc0(6,[3*231,5,1]);
    }else if(t == 1){
        this.setHaloParams(1,0,0, function(){
          dsp.rpc0(6,[3*231,3,1]);
          setTimeout(function(){
            dsp.rpc0(KERN_API_RPC, [KAPI_RPC_TEST, 1]);
            console.log('testing')
          }, HALO_TEST_DELAY*1000)
          return;
      })
    }else if(t == 2){
       this.setHaloParams(0,1,0, function(){
         dsp.rpc0(6,[3*231,3,1]);
          setTimeout(function(){
            dsp.rpc0(KERN_API_RPC, [KAPI_RPC_TEST, 1])
          }, HALO_TEST_DELAY*1000)
      })
    }else if(t == 3){
       this.setHaloParams(0,0,1, function(){
         dsp.rpc0(6,[3*231,3,1]);
          setTimeout(function(){
            dsp.rpc0(KERN_API_RPC, [KAPI_RPC_TEST, 1])
          }, HALO_TEST_DELAY*1000)
      })
    }
    setTimeout(function(){return },1000);
  }

  photoEye(callback){
  	console.log('photoeye...')
    var dsp = this.dsp;
    dsp.rpc0(5,[0,1,1])
    setInterval(function () {
        dsp.rpc0(5,[0,1,1]);
        setTimeout(function () {
            dsp.rpc0(NP_RPC,[]);
            callback();
        }, 100)
    },1000)
  }

  rpc_stream(stream_time, callback){
  	if(stream_time == 0){
  		console.log("stream time is nothing")
  	}
  	console.log('streaming rpc data...')
    var dsp = this.dsp;
 	var arm = new arm_rpc.ArmRpc(dsp);
	return new Promise(function(){
	    dsp.rpc0(22,[26,stream_time]); // streaming rpc in seconds
	}).then(callback())
  }

  rpc_stream_end(callback){
    var dsp = this.dsp;
 	var arm = new arm_rpc.ArmRpc(dsp);
 	dsp.rpc0(22,[26,1])
	dsp.rpc0(22,[26,0]) // steam with length of 0. so stops
    // dsp.rpc0(22,[27]); // streaming end rpc
    setTimeout(function () {
  		callback()
    }, 30)
	    
  }

  dsp_manual_test(callBack){
		console.log('dsp manual test')
	var ra =[]
	var xa =[]
	var idx
	var s = dgram.createSocket({'type': 'udp4', 'reuseAddr': true})
	var dsp = this.dsp;
	var self = this

	s.bind(DSP_SCOPE_PORT,'0.0.0.0', function(){
		dsp.rpc0(6,[3*231,3]);
	});

	s.on('message', function(e,rinfo){
		if(e){
			var idx = e.readInt16LE(0);
			var r = e.readInt16LE(2);
			var x = e.readInt16LE(4);
			var rx_data=[r,x,idx];
			ra.push(r);
			xa.push(x);
			writer(rx_data)
			if (idx == 1){
				callBack([ra,xa]);
				s.close();
				s.unref();
			}
		}else{
			s.close();
		}
	});

	s.on('close', function(){
		console.log('closing')
		s.unref();
		callBack()
	});
  }

 // async my_product_rec_rpc(dsp_ip){
	// 	this.bindNP(dsp_ip,()=>{})
 //  }



}

async function getFileTftp(ip,remote,local,callback,enoent){
  var tclient = tftp.createClient({host:ip,retries:10, timeout:500})
  tclient.get(remote,local,function(err){
    if(err){
    	console.log("error getfile tftp",err)
      // enoent(err);
    }else{
      callback();
    }
  })
}

async function Locate_button(){
	console.log("locate button")
	let myIp = new Promise((resolve, reject) => {
		arloc.ArmLocator.scan(1,function(list){
			console.log('##### device : ' + list);
			resolve(list)
			// callback(list)
		});
	})

	myIp.then((results)=>{
		return results
	})
	return await myIp
}


// ####################################################################
// Parse class is for parsing the product record with the vdef
// not dealing with this yet
// ####################################################################
// function Fti_Scope(){
class parse
{
	constructor(){

	}

	parseRec(sRec,pRec,rawVdef){
		var vdef = JSON.parse(rawVdef.toString())
	    //sRec and pRec should be the raw buffers
	    var self = this
	    var pVdef = [{},{}]
	    // console.log(vdef)
		vdef['@params'].forEach(function(p){
		if(p['@rec'] == 0){
		  pVdef[0][p['@name']] = p
		}else if(p['@rec'] == 1){
		  pVdef[1][p['@name']] = p
		}
		})



	  	//So here I'm just reorganizing the vdef, so I'm working with a name based dictionary for each record.
		var sysArray = [];
		var prodArray = [];
		for(var i = 0; i<(sRec.length/2); i++){
			sysArray[i] = sRec.readUInt16LE(i*2 + 1);
		}

		for(var i = 0; i<(pRec.length/2); i++){
			prodArray[i] = pRec.readUInt16LE(i*2 + 1);
		}
		//Because the vdef is described as an word array (16bits for each row) I'm converting the buffers to word arrays to match.

		var sysRec = {}
		var prodRec = {}
		for(var s in pVdef[0]){
			sysRec[s] = self.getVal(sysArray,0,s,pVdef)
		}

		for(var p in pVdef[1]){
			prodRec[p] = self.getVal(prodArray,1,p,pVdef)
		}
	}

	getVal(arr, rec, key, pVdef){
	    //console.log([rec,key])
	    var param = pVdef[rec][key]
	    var self = this

	    if(param['@bit_len']>16){
	      pVdef = null;
	      return wordValue(arr, param)
	    }else{
	      var val;
	      if((param['@bit_pos'] + param['@bit_len']) > 16){
	        var wd = (arr[param['@i_var']+1]<<16) | (arr[param['@i_var']])
	        val = (wd >> param["@bit_pos"]) & ((1<<param["@bit_len"])-1)
	      }else{
	        val = arr[param["@i_var"]];
	        if(typeof param['@name'] != 'undefined'){
	          if((param['@name'].indexOf('HaloPeak') != -1) && (param['@bit_len'] == 16)){
	              val = uintToInt(val,16)
	            }
	          }
	      }

	      if(param["@bit_len"] < 16){
	        val = (val >> param["@bit_pos"]) & ((1<<param["@bit_len"])-1)
	      }
	      param = null;
	      arr = null;
	      pVdef = null;
	      return val;
	    }
	}

	wordValue(arr, p){
	    var n = Math.floor(p["@bit_len"]/16);
	    var sa = arr.slice(p["@i_var"], p["@i_var"]+n)
	    arr = null;
	    var self = this

	    if(p['@type']){
	      //funcJSON['@func'][p['@type']].apply(this, sa) 1980/00/00 00:00:02
			return Params[p['@type']](sa)
	    //  return eval(funcJSON['@func'][p['@type']])(sa)
	    }else if('DateTime' == p['@name']){
			var sa0 = sa[0]
			var sa1 = sa[1]
			var month
			var sec = ('0' + ((sa0&0x1f)*2).toString()).slice(-2)
			var min = ('0' + ((sa0>>5)&0b111111).toString()).slice(-2)
			var hr =  ('0' +(sa0>>11).toString()).slice(-2);
			var dd = ('0' +(sa1 & 0x1f).toString()).slice(-2)
			var mm = ('0' + ((sa1 >>5)&0xf).toString()).slice(-2)
			var year = 1980 + (sa1 >> 9)
			return year+'/'+mm+'/'+dd + ' ' +hr +':'+min+':'+sec ;
	    }else if('EtherExtPorts' == p['@name']){
	        return sa[0]
	    }else{
			var str = sa.map(function(e){
				return (String.fromCharCode((e%256),(e>>8)));
		    }).join("");
		    sa = null;
		    p = null;
		    return str;
	    }
	}
}

module.exports.scope_collector = scope_collector
module.exports.Locate_button = Locate_button
// ####################################################################
// client.js
// this client page handles user interaction sending XHR requests to Server.js
// The user interaction uses form input submition and a few buttons which handle application functionality
// ####################################################################

let Time = document.getElementById('time')
let Info = document.getElementById('info')
let Customer = document.getElementById('customer')

// ####################################################################
// locateButton() sends Locate request
// populates select options and input on interface
// ####################################################################
let locateButton = ()=>{
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'locator', true);
	xhr.onerror = function(){
		console.log("request error...")
	}
	xhr.onload = function (){
		if(this.status == 200){
			var response = this.responseText
			document.getElementById("state").innerHTML = "DSP IP LOCATE"
			document.getElementById("index").innerHTML = response;

			// dspArray = Array.from(response)ad
			dspArray = JSON.parse(response)
			if(Array.isArray(dspArray)){
				console.log('client dsp info', dspArray)
				// populate IP select dropdown
				if (dspArray[3] == " not a dspboard"){
					var select = document.getElementById('selectDSP')
					var option = document.createElement("option"),
					text = document.createTextNode(dspArray)
					option.appendChild(text)
					select.insertBefore(option,select.lastChild);
					document.getElementById("state").innerHTML = "Locate can't find a DSP board"

				}else if(dspArray[2] != NaN){
					var select = document.getElementById('selectDSP')
					var option = document.createElement("option"),
					text = document.createTextNode(dspArray[2])
					option.appendChild(text)
					select.insertBefore(option,select.lastChild);
					var input = document.getElementById('ip_input')
					input.value = dspArray[2]

				}else {
					var select = document.getElementById('selectDSP')
					var option = document.createElement("option"),
					text = document.createTextNode(dspArray)
					option.appendChild(text)
					select.insertBefore(option,select.lastChild);
				}
				
			};
		}
	}
	xhr.send()
}

// ####################################################################
// ipSend() sends ip from locate button to be sent to scope
// ####################################################################
let ipSend = ()=>{
	var connect_ip = document.getElementById('ip_input').value
	console.log("my ip from ip_send ", connect_ip)
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'connect', true);
	xhr.onerror = function(){
		console.log("request error...")
	}
	xhr.onload = function (){
		if(this.status == 200){
			var response = this.responseText
			document.getElementById("state").innerHTML = "connecting to DSP"
			document.getElementById("index").innerHTML = 'DSP IP = '+connect_ip;
		}
	}
	xhr.send(connect_ip)

}

// ####################################################################
// formSubmit() sends XML http Time and product info to server from client form
// ####################################################################
let formSubmit=()=>{
	var data = 'customer : ' +customer.value+ ', time : '+time.value+', info : '+info.value;
	var dataJSON = '{"customer":"'+customer.value+'","detector_serial":"'+detect_serial.value+'","detector_size":"'+detect_size.value+'","time":"'+time.value+'","info":"'+info.value+'"}';
	var xhr = new XMLHttpRequest();
	console.log(dataJSON);
	xhr.open('POST', 'scopeform', true);
	xhr.onerror = function(){
		console.log("request error...")
	}

	xhr.onload = function (){
		if(this.status == 200){
			var response = this.responseText
			console.log('responding to form', response)
			
			if(isNaN(time.value)  ){
				console.log('Session Time argument is not valid, please enter a number for streaming scope data in millieseconds')
				document.getElementById("state").innerHTML = 'Session Time argument is not valid, please enter a number for streaming scope data in millieseconds';
				document.getElementById("index").innerHTML = data;
			}
			else if (time.value == 0){
				console.log("time value is empty")
				console.log('Session Time argument is not valid, please enter a number for streaming scope data in millieseconds')
				document.getElementById("state").innerHTML = 'Session Time argument is not valid, please enter a number for streaming scope data in millieseconds';
				document.getElementById("index").innerHTML = 'time value is empty';
			}else{
				document.getElementById("state").innerHTML = "Form submitted"
				document.getElementById("index").innerHTML = data;
			}
		}
	} 

	xhr.send(dataJSON)
}

// ####################################################################
// close() sends XML http request from main library to close app
// ####################################################################
var close=()=>{
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'close', true);
	xhr.onerror = function(){
		console.log("request error...")
	}
	xhr.onload = function (){
		if(this.status == 200){
			var response = this.responseText
			console.log(response)
			document.getElementById("state").innerHTML = response;
		}
	}
	xhr.send()
}

// ####################################################################
// scopeTrigger() sends XML http request from main library
// tests value of form time before preceeding
// ####################################################################
var scopeTrigger=()=>{
	console.log('client scope trigger',time.value )
	if(isNaN(time.value)  ){
		console.log('time argument is not valid, please enter a number for streaming scope data in millieseconds')
		document.getElementById("state").innerHTML = 'time argument is not valid!!! Submit a number in time form';

	}else if (time.value == 0){
		console.log("time value is empty, will stream continously")
		var scopeDiv = document.getElementById('divscope')
		var stopBtn =''
		if(document.getElementById("stop_button")){
				document.getElementById("stop_button").remove()
		}
		cleanIndex()

		document.getElementById("state").innerHTML = 'Streaming Scope';
		document.getElementById("index").innerHTML = 'streaming continously';
		
		var stopBtn = document.createElement("button")
		stopBtn.setAttribute("class",'button button2')
		stopBtn.setAttribute("id", 'stop_button');
		stopBtn.innerHTML = 'Stop Scope Streaming';
		stopBtn.addEventListener('click',  scopeclose)
	    scopeDiv.appendChild(stopBtn);

		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'scope', true);
		xhr.onerror = function(){
			console.log("** An error occurred during the transaction");
		}
		xhr.onload = function (){
			if(this.status == 200){
				console.log("stream continously post status", this.responseText)
				if(this.responseText == "Scope Streaming"){
					var stopBtn = document.createElement("button")
					// stopBtn.setAttribute("class",'button button2')
					// stopBtn.setAttribute("id", 'stop_button');
					// stopBtn.innerHTML = 'Stop Scope Streaming';
					// stopBtn.addEventListener('click',  scopeclose)
				 //    scopeDiv.appendChild(stopBtn);
					document.getElementById("state").innerHTML = this.responseText
					document.getElementById("index").innerHTML = " "
					// document.getElementById("state").innerHTML = 'streaming '
				}else if(this.responseText == "server no dsp"){
					document.getElementById("state").innerHTML = this.responseText
					document.getElementById("index").innerHTML = "No DSP available"
					console.log("server no dsp remove the stop button")
					if(document.getElementById("stop_button")){
						document.getElementById("stop_button").remove()
					}
				} 
			}
		}

		xhr.send('streaming')
	}else {
		console.log('server scope trigger',time.value )
		
		var scopeDiv = document.getElementById('divscope')
		var stopBtn =''
	
		if(document.getElementById("stop_button")){
				document.getElementById("stop_button").remove()
			}

		cleanIndex()

		var stopBtn = document.createElement("button")
		stopBtn.setAttribute("class",'button button2')
		stopBtn.setAttribute("id", 'stop_button');
		stopBtn.innerHTML = 'Stop Scope Streaming';
		stopBtn.addEventListener('click',  scopeclose)
	    scopeDiv.appendChild(stopBtn);

		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'scope', true);
		setTimeout(()=>{progbar()},500)
		xhr.onerror = function(){
			console.log("** An error occurred during the transaction");
		}

		xhr.onload = function (){
			if(this.status == 200){
				if (this.responseText =="scope stream"){
					console.log('dsp available')
					
					document.getElementById("state").innerHTML = this.responseText
				}
				else if(this.responseText == "server no dsp"){
					console.log('no dsp')
					document.getElementById("state").innerHTML = 'no dsp'
					setTimeout(()=>{
						if(document.getElementById("myProgress")){
							var prog = document.getElementById("myProgress")
							prog.parentNode.removeChild(prog)
						}
					},500)
				}
			
				 else {
					document.getElementById("state").innerHTML = 'streaming scope'
				}
				
			}
		}
	   xhr.send(time.value)

	   setTimeout(()=>{
	   		document.getElementById("state").innerHTML = 'Done Streaming';
	   		if(document.getElementById("myBar")){
				document.getElementById("myBar").remove();
			}
	   		if(document.getElementById("stop_button")){
				document.getElementById("stop_button").remove()
			}
	   },((time.value * 1000) + 6000))
	}
}

// ####################################################################
// scopeclose() sends XML http request to close scope streaming
// ####################################################################
var scopeclose=()=>{
	cleanIndex()
	if(document.getElementById("stop_button")){
				document.getElementById("stop_button").remove()
			}
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'scope_end', true);
	xhr.onload = function (){
		if(this.status == 200){
			document.getElementById("state").innerHTML = this.responseText
		}
	}
	xhr.onerror = function(){
		console.log("request error...")
	}
	xhr.send()
}


// ####################################################################
// indexTable() recieves data and populates HTML table
// ####################################################################
var indexTable = (data) =>{
	cleanIndex()

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'indexJSON', true);
	xhr.onload = function (){
		if(this.status == 200){
			var parsedIndex = this.responseText
			console.log(parsedIndex)
			if (this.responseText =="scope stream")
					console.log('dsp available')
					
					document.getElementById("state").innerHTML = this.responseText
				}
			var response = this.responseText
			var myObj, x, txt = "";
			if(this.responseText == "no JSON data available"){
				console.log('parse error', this.responseText)
				document.getElementById("index").innerHTML = "no JSON data available"
			}
			else{
				document.getElementById("state").innerHTML = 'load Index data';
				if(JSON.parse(this.responseText)){
					var myObj = JSON.parse(this.responseText);
			        txt += "<table id='mytable'  class='table table-hover table-light table-sm table-responsive'>"
			        txt += "<thead><tr class='table-info'><th> time </th><th> size of file </th><th> Customer </th><th> Detector Serial Number </th><th> Detector Size </th><th> message </th><th> lines before </th><th> lines added </th><th> total lines </th><th> run time </th></tr></thead>"
			        for (x in myObj) {
			        	txt += "<tr><td>" + myObj[x]["Time"]+ "</td>"
		        		txt += "<td>" + myObj[x]["size of ./scope_data/scopedata.txt"]+ "</td>"
			        	txt += "<td>" + myObj[x]["Customer"]+ "</td>"
			        	txt += "<td>" + myObj[x]["Detector Serial"]+ "</td>"
			        	txt += "<td>" + myObj[x]["Detector Size"]+ "</td>"
			        	txt += "<td>" + myObj[x]["Message"]+ "</td>"
			        	txt += "<td>" + myObj[x]["amount of lines before collecting"]+ "</td>"
			        	txt += "<td>" + myObj[x]["amount of lines added"]+ "</td>"
			        	txt += "<td>" + myObj[x]["total lines"]+ "</td>"
			        	txt += "<td>" + myObj[x]["run time"]+ "</td></tr>"
			        }
			       	txt += "</table>"  
			        document.getElementById("index").innerHTML += txt ;
				}
			}
			
			
		// }
	}

	xhr.onerror = function(){
		console.log("request error...")
	}

	xhr.send()
}

// ####################################################################
// resetData() sends XML http request to erase all data files
// ####################################################################
var resetData=()=>{
	cleanIndex()
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'reset', true);
	xhr.onload = function (){
		if(this.status == 200){
			var response = this.responseText
			console.log(response)
			document.getElementById("state").innerHTML = response
			document.getElementById("state").innerHTML = 'Reset Data files '
		}
	}

	xhr.onerror = function(){
		console.log("request error...")
	}

	xhr.send()
}

// ####################################################################
// downloadData() sends XML http request for compressed data files
// ####################################################################
var downloadData=()=>{
	var xhr = new XMLHttpRequest();

	cleanIndex()
	xhr.open('POST', 'download', true);
	xhr.setRequestHeader('Content-disposition', 'attachment')
	xhr.setRequestHeader("Content-type","application/zip");
	xhr.setRequestHeader("Encoding", "null")
	xhr.responseType = "blob";

	xhr.onload = function (){
		if(this.status == 200){
			let form = document.createElement("form");
		    let element1 = document.createElement("input"); 
		    document.body.appendChild(form);
		   
			let response = this.response
			document.getElementById("state").innerHTML = 'download'
			document.getElementById("index").innerHTML = 'wait for browser to download file';
			var blob = new Blob([response], {type: "application/zip"});
		    var file = URL.createObjectURL(blob);
		    filename = 'Data.zip'
		    var a = document.createElement("a");
		    if ("download" in a) {
		      a.href = file;
		      a.download = filename;
		      document.body.appendChild(a);
		      a.click();
		      document.body.removeChild(a);
			}
		}
	}

	xhr.onerror = function(err){
		console.log("request error...",err)
	}

	xhr.send()
}

// ####################################################################
// emailForm() creates email form
// ####################################################################
var emailForm = () =>{
	
	cleanIndex()

	document.getElementById("state").innerHTML = 'Enter email address'
	document.getElementById("index").innerHTML = ''
	var divForm = document.createElement('div')
	var myForm = document.createElement('form');
	var eForm = document.createElement('input');
	var labelForm = document.createElement("label");
	var linebreak = document.createElement("br");
	var buttonForm = document.createElement("input");

	divForm.setAttribute("id",'divF')
	myForm.setAttribute("id", 'myF');

	labelForm.setAttribute("for", 'email');
	labelForm.setAttribute("class", 'label');
	labelForm.setAttribute("id", 'labelF');
	
	eForm.setAttribute("type",'text');
	eForm.setAttribute("name",'email');
	eForm.setAttribute("id",'email-id');
	eForm.setAttribute("class", 'form-group form-email');
	eForm.setAttribute("value",'enter email');
	eForm.setAttribute("autocomplete",'off')

	buttonForm.setAttribute("type", 'button');
	buttonForm.setAttribute("value", 'submit');
	buttonForm.setAttribute("name", 'submit');
	buttonForm.setAttribute("class", 'button');
	buttonForm.setAttribute("class", 'button3');
	buttonForm.setAttribute("id", 'email_button');

	index.appendChild(divForm);
	document.body.appendChild(myForm);
	divForm.appendChild(myForm);
	myForm.appendChild(labelForm);
	document.getElementById('labelF').innerHTML = 'email ';
	myForm.appendChild(linebreak);
	myForm.appendChild(eForm);
	myForm.appendChild(buttonForm);
	document.getElementById('email_button').addEventListener('click', emailData)
}

// ####################################################################
// email() sends XML http request for nodemailer trigger
// ####################################################################
var emailData=()=>{
	let emailAddr = document.getElementById('email-id').value // retreive email from input value
	console.log('client  email addre', emailAddr)
	document.getElementById("state").innerHTML = ' email'

	let xhr = new XMLHttpRequest();
	xhr.open('POST', 'email', true);
	xhr.onload = function (){
		if(this.status == 200){
			var response = this.responseText
			console.log(response)
			document.getElementById("state").innerHTML = 'email data files '
			document.getElementById("index").innerHTML = 'email sent to ' + response
		}
	}
	xhr.onerror = function(err){
		console.log("request error...", err)
	}
	xhr.send(emailAddr)
}

// ####################################################################
// progbar() DOM manipulation animated scope streaming status progress bar
// ####################################################################
var progbar=()=>{
	cleanIndex()
	var scopediv = document.getElementById('divscope')
    var myProgress = document.createElement("div");
    var myBar = document.createElement("div");
    myProgress.id = "myProgress"
    myBar.id = "myBar"
    scopediv.appendChild(myProgress);
    myProgress.appendChild(myBar);
    var elem = document.getElementById("myBar");   
	var width = 0;
	var id = setInterval(frame, time.value * 10); // this is where we add our time value
	function frame() {
		if (width >= 100) {
		  clearInterval(id);
		} else {
		  width++; 
		  elem.style.width = width + '%'; 
		  elem.innerHTML = width * 1 + '%';
		}
	}
}


var cleanIndex=()=>{
	if(document.getElementById("divF")){
		index.removeChild(divF);
	}

	if(document.getElementById("mytable")){
		var c = document.getElementById("mytable")
		c.remove();
	}

	document.getElementById("index").innerHTML = ''
	
	if(document.getElementById("myBar")){
		document.getElementById("myBar").remove();
	}

}

document.getElementById('locate').addEventListener('click', locateButton)
document.getElementById('submit').addEventListener('click', formSubmit)
document.getElementById('close_scope').addEventListener('click', close)
document.getElementById('reset').addEventListener('click', resetData)
document.getElementById('bt_index').addEventListener('click', indexTable)
// document.getElementById('close_scope').addEventListener('click', close)
document.getElementById('scope').addEventListener('click', scopeTrigger)
document.getElementById('download').addEventListener('click', downloadData)
document.getElementById('email_data').addEventListener('click', emailForm)
document.getElementById('ip_connect').addEventListener('click', ipSend)

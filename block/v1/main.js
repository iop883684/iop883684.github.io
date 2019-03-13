

var lastBlock = 0;
var lastMinedBlock = 0;
var message = "<br>";

// Helper

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {

        if (xmlHttp.readyState == 4) {
        	if (xmlHttp.status == 200){
        		callback(xmlHttp.responseText);
        	} else{
        		document.getElementById("status").innerHTML = xmlHttp.statusText;
        		reloadAllData();
        	}
            

        }
    }

    xmlHttp.ontimeout = function() {

    	document.getElementById("status").innerHTML = "Request timeout";
    	reloadAllData();

    };

    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function timeStamToDate(unix_timestamp){

	var date = new Date((unix_timestamp)*1000);
	// Hours part from the timestamp
	var hours = date.getHours();
	// Minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	var seconds = "0" + date.getSeconds();

	// Will display time in 10:30:23 format
	var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
	return formattedTime;

}

function stringToDate(dateStr){

	// console.log(dateStr);

 	var date =	new Date(dateStr);
 	

	var hours = date.getHours();
	// Minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	var seconds = "0" + date.getSeconds();

	// Will display time in 10:30:23 format
	var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
	return formattedTime;

}

function updateMessage(newBLock, text){

	var me = "<br>";

    if (text == "split"){
       me += '<font color="#ff6600">';
    }

	me += stringToDate(Date()) + " => " + text + " : ";


	for (var i = 0; i < newBLock.length; i++) {
		me +=  newBLock[i] + ", ";
	}

    if (text == "split"){
       me += '</font>';
    }

	message = me + message;
	document.getElementById("message").innerHTML = message;

	if (text == "split"){

		var audio = new Audio('new_mined_block.wav');
		audio.play();
		runTimer();
		notifyMe(newBLock.length + " block just split");

	} else{

		// var audio = new Audio('new_block.wav');
		// audio.play();

	}
	

}


function updateMinedBlock(newData){


	if (typeof minedBlock === 'undefined'){

		for (var i = 0; i < newData.length; i++) {
			newData[i]["split_time"] = Date();
		}
		minedBlock = newData;

		return;
	}

	var newBLock = Array();

	for (var i = 0; i < newData.length; i++) {

		var currentBlock =  newData[i];
		var indexOfBlock = containMinedBock(currentBlock["number"])

		if (indexOfBlock == -1){
			//update block not exist yet
			currentBlock["split_time"] = Date();
			minedBlock.unshift(currentBlock);
			newBLock.push(currentBlock["number"]);

		}

	}

	updateMessage(newBLock, "split");


}


function updatePoolStatus(minedData){


    document.getElementById("hashRate").innerHTML =  minedData["data"]["poolStats"]["hashRate"];
    document.getElementById("miners").innerHTML =  minedData["data"]["poolStats"]["miners"];
    document.getElementById("workers").innerHTML =  minedData["data"]["poolStats"]["workers"];
    document.getElementById("blocksPerHour").innerHTML =  minedData["data"]["poolStats"]["blocksPerHour"];

     document.getElementById("btc").innerHTML =  minedData["data"]["price"]["btc"];
    document.getElementById("usd").innerHTML =  minedData["data"]["price"]["usd"];

}

function getMinedBlock(){


	document.getElementById("status").innerHTML = "Getting mined block";

	httpGetAsync("https://api-zcash.flypool.org/poolStats", function(response) {

        var json = JSON.parse(response);
        updatePoolStatus(json);

        var data = json["data"]["minedBlocks"];

        var currentLastBlock = data[0]["number"];
        console.log("last mined block:",currentLastBlock);

        if (currentLastBlock != lastMinedBlock){

        	// console.log("time:", (Date.now() / 1000) - data[0]["time"]);
        	lastMinedBlock = currentLastBlock;
        	// minedBlock  = data;
        	updateMinedBlock(data);
			updateLayout()

        }
        // a.pop();

        getAllBlocks()


    });

}

function containBlock(block_number){

	if (typeof minedBlock === 'undefined'){
		return;
	}

	for (var i = 0; i < rows.length; i++) {
        	if (rows[i]["height"] == block_number){
        		return i;
        	}
     }

     return -1;

}


function updateAllBlock(newData){


	if (typeof rows === 'undefined'){

		rows = newData;
		return;
	}

	var newBLock = Array();

	for (var i = 0; i < newData.length; i++) {

		var currentBlock =  newData[i];
		var indexOfBlock = containBlock(currentBlock["height"]);

		if (indexOfBlock >= 0){

			updateMessage(newBLock, "new");
			rows = newData;
			return;

		}else{

			// if (currentBlock["poolInfo"]["poolName"] != undefined){
			// 	if ( currentBlock["poolInfo"]["poolName"]  == "Stratum"){
	  //       		var audio = new Audio('spect.wav');
			// 		audio.play();
			// 		notifyMe("Stratum block appear!");
   //      		}

			// }
			

			newBLock.push(currentBlock["height"]);

		}
	}

	rows = newData;


}


function getAllBlocks(){

	document.getElementById("status").innerHTML = "Getting all block";

    httpGetAsync("https://zcashnetwork.info/api/blocks?limit=15", function(response){

         var data = JSON.parse(response);
         var blocks = data["blocks"]

         var last =  blocks[0]["height"];
         console.log("last gen block:",last);

         if (last != lastBlock){
         	// console.log("block time:", (Date.now() / 1000) - rows[0]["time"]);

         	updateAllBlock(blocks);
        	lastBlock = last;
			updateLayout();

        } 
        
        document.getElementById("status").innerHTML = "Done";

        reloadAllData();

	});
        

}


function containMinedBock(block_number){

	if (typeof minedBlock === 'undefined'){
		return;
	}

	for (var i = 0; i < minedBlock.length; i++) {
        	if (minedBlock[i]["number"] == block_number){
        		return i;
        	}
     }

     return -1;

}

function updateLayout(){

	if (typeof rows === 'undefined'){
		return;
	}

	 var html = "<table border=' 1 |1'>";

	  html+="<tr>";

        html+="<th>  Height  </th>";
        html+="<th> Mined time </td>";
        html+="<th>Flypool time</td>";
        html+="<th> Split time </td>";
        html+="<th> Mined by </th>";

    for (var i = 0; i < rows.length; i++) {
        html+="<tr>";

        var block_number =  rows[i]["height"];

        html+="<td>"+block_number+"</td>";
        html+="<td>"+timeStamToDate(rows[i]["time"])+"</td>";

        
        // console.log("minded:", minedBlock);
        var indexOfBlock = containMinedBock(block_number) 
        // console.log("block", block_number ," index:", indexOfBlock);

        if ( indexOfBlock >= 0){

        	html+="<td>"+timeStamToDate(minedBlock[indexOfBlock]["time"])+"</td>";
        	html+="<td>"+stringToDate(minedBlock[indexOfBlock]["split_time"])+"</td>";
        } else{
        	html+="<td> </td>";
        	html+="<td> </td>";
        }
        

        if (rows[i]["poolInfo"]["poolName"] != undefined){

        	html+="<td> "+ rows[i]["poolInfo"]["poolName"] + "</td>";
        } else{
        	html+="<td>  </td>";
        }
        

        html+="</tr>";

    }
    html+="</table>";
    // $("div").html(html);
    document.getElementById("data").innerHTML = html;

    checkNumberMinedAble()

}

function checkNumberMinedAble(){


	var availableBlock = 0;


    for (var i = 0; i < rows.length; i++) {

        var block_number =  rows[i]["height"];

        var indexOfBlock = containMinedBock(block_number) 
        // console.log("block", block_number ," index:", indexOfBlock);

        if ( indexOfBlock == -1){

        	if (rows[i]["poolInfo"]["poolName"] != undefined){
        		if (rows[i]["poolInfo"]["poolName"] == "Bitfly"){
        			availableBlock++;
	        	} 
	        } 

        }

    }


	document.title = availableBlock + " block available";

	if (availableBlock > 2){
		// notifyMe(availableBlock + " block available");
		var audio = new Audio('new_block.wav');
		audio.play();
	}

}


function reloadAllData(){

	//reload data
	setTimeout( getMinedBlock, 15000 ); 
	//start countdown
	countDownTimer(14); 

}

setTimeout( getMinedBlock, 1000 ); 


function countDownTimer(duration) {

    var timer = duration;

    setInterval(function () {

    	timer--;

        if (timer < 0) {
            return;
        }

        document.getElementById("status").innerHTML = "Reload after " + timer + "s";

    }, 1000);
}


function runTimer() {

    var timer = 0;

    if (typeof upTimer !== 'undefined'){
		clearInterval(upTimer);
  	}

    upTimer = setInterval(function () {

    	timer++;
        document.getElementById("time").innerHTML =  secondsToTime(timer);

    }, 1000);

}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

function secondsToTime(secs)
{

    var totalSeconds = Math.round(secs);

    var seconds = pad(totalSeconds % 60);
    var minutes = pad(parseInt(totalSeconds / 60));

    return minutes+":"+seconds;
}


// request permission on page load

document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function notifyMe(notiMessage) {

  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('Notification', {
      icon: 'https://z.cash/theme/images/yellow-zcash-logo.png',
      body:  notiMessage,
    });

    notification.onclick = function () {
      window.open("https://zcashnetwork.info/blocks-date/2018-01-14/1515974400");      
    };
    
  }

}



// function readTextFile(file, callback) {
//     var rawFile = new XMLHttpRequest();
//     rawFile.overrideMimeType("application/json");
//     rawFile.open("GET", file, true);
//     rawFile.onreadystatechange = function() {
//         if (rawFile.readyState === 4 && rawFile.status == "200") {
//             callback(rawFile.responseText);
//         }
//     }
//     rawFile.send(null);
// }

// //usage:
// readTextFile("blocks.json", function(text){
//     var data = JSON.parse(text);
//     console.log(data);
// });

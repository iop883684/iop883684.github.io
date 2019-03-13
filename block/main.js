

var lastBlock = 0;
var lastZec = 0;
var zecToBtc = 0.0;
var message = "<br>";
var minedBlockSound = new Audio('new_mined_block.wav');
var newBlockSound = new Audio('new_block.wav');
var currentBlockWeb = 0;
var walletAddress = "";

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

    if (text == "web split"){
       me += '<font color="#009933">';
    }

	me += stringToDate(Date()) + " => " + text + " : ";


	for (var i = 0; i < newBLock.length; i++) {
		me +=  newBLock[i] + ", ";
	}

    if (text == "web split"){
       me += '</font>';
    }


	message = me + message;
	document.getElementById("message").innerHTML = message;

	if(text == "web split"){
		
        minedBlockSound.play();
        runWebTimer();
        notifyMe(newBLock.length + " web block just split");

	}

     checkNumberMinedAble();

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

    if (newBLock.length > 0){
        updateMessage(newBLock, "api split");
    }


}


function updatePoolStatus(minedData){

    document.getElementById("hashRate").innerHTML =  minedData["data"]["poolStats"]["hashRate"];
    document.getElementById("miners").innerHTML =  minedData["data"]["poolStats"]["miners"];
    document.getElementById("workers").innerHTML =  minedData["data"]["poolStats"]["workers"];
    document.getElementById("blocksPerHour").innerHTML =  minedData["data"]["poolStats"]["blocksPerHour"];

    zecToBtc = minedData["data"]["price"]["btc"];
     document.getElementById("btc").innerHTML =  minedData["data"]["price"]["btc"];
    document.getElementById("usd").innerHTML =  minedData["data"]["price"]["usd"];


}

function getMinedBlock(){


	document.getElementById("status").innerHTML = "Getting mined block";

	httpGetAsync("https://api-zcash.flypool.org/poolStats", function(response) {

        var json = JSON.parse(response);
        updatePoolStatus(json);

        var data = json["data"]["minedBlocks"];

        // var currentLastBlock = data[0]["number"];
        // console.log("last mined block:",currentLastBlock);

    	updateMinedBlock(data);
		updateLayout()

        // a.pop();
        getMinedBlockWeb();


    });

}


function containMinedBockWeb(block_number){

    if (typeof minedBlockWeb === 'undefined'){
        return;
    }

    for (var i = 0; i < minedBlockWeb.length; i++) {
            if (minedBlockWeb[i]["number"] == block_number){
                return i;
            }
     }

     return -1;

}



function updateMinedBlockWeb(newData){


    if (typeof minedBlockWeb === 'undefined'){

        for (var i = 0; i < newData.length; i++) {
            newData[i]["split_time"] = Date();
        }
        minedBlockWeb = newData;
        return;
    }

    var newBLock = Array();

    for (var i = 0; i < newData.length; i++) {

        var currentBlock =  newData[i];
        var indexOfBlock = containMinedBockWeb(currentBlock["number"])

        if (indexOfBlock == -1){
            //update block not exist yet
            currentBlock["split_time"] = Date();
            minedBlockWeb.unshift(currentBlock);
            newBLock.push(currentBlock["number"]);

        }

    }

    if (newBLock.length > 0){
        updateMessage(newBLock, "web split");
    }
    


}


function getMinedBlockWeb(){


    document.getElementById("status").innerHTML = "Getting mined block web";

    httpGetAsync("https://api-zcash.flypool.org/blocks", function(response) {

        var json = JSON.parse(response);

        var data = json["data"];

        // var currentLastBlock = data[0]["number"];
        // console.log("last mined web:",currentLastBlock);

        // minedBlockWeb  = data;
        updateMinedBlockWeb(data);
        updateLayout()

        getAllBlocks()


    });

}

function containBlock(block_number){

	if (typeof rows === 'undefined'){
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
        checkNumberMinedAble();
		return;
	}

	var newBLock = Array();

	for (var i = 0; i < newData.length; i++) {

		var currentBlock =  newData[i];
		var indexOfBlock = containBlock(currentBlock["height"]);

		if (indexOfBlock >= 0){

			rows = newData;
            updateMessage(newBLock, "new");
			return;

		}else{

			newBLock.push(currentBlock["height"]);

		}
	}

	rows = newData;


}


function getAllBlocks(){

	document.getElementById("status").innerHTML = "Getting all block";

    //https://zcashnetwork.info/api/blocks?limit=12
    //https://api.zcha.in/v2/mainnet/blocks?sort=height&direction=descending&limit=5&offset=0
    /*
    httpGetAsync("https://api.zcha.in/v2/mainnet/blocks?sort=height&direction=descending&limit=12&offset=0", function(response){

         var data = JSON.parse(response);
         var blocks = data;//["blocks"]
         var last =  blocks[0]["height"];

	});
    */

    httpGetAsync("https://zcashnetwork.info/api/blocks?limit=12", function(response){

         var data = JSON.parse(response);
         var blocks = data["blocks"]

         var last =  blocks[0]["height"];
         // console.log("last block:",last);

         if (last != lastBlock){
            // console.log("block time:", (Date.now() / 1000) - rows[0]["time"]);

            updateAllBlock(blocks);
            lastBlock = last;
            updateLayout();

        } 
        
        document.getElementById("status").innerHTML = "Done";

        reloadAllData();
         getZecStatus();

    });

        

}


function updateLayout(){

	if (typeof rows === 'undefined'){
		return;
	}

	 var html = "<table border=' 1 |1'>";

	  html+="<tr>";

        html+="<th>  Height  </th>";
        html+="<th> Mined time </td>";
        html+="<th>Split time Web</td>";
        html+="<th> Server </th>";
        html+="<th> Split time Api</td>";
        html+="<th> Mined by </td>";
        

    for (var i = 0; i < rows.length; i++) {
        html+="<tr>";

        var block_number =  rows[i]["height"];

        html+="<td>"+block_number+"</td>";
        html+="<td>"+timeStamToDate(rows[i]["time"])+"</td>";

        
        var indexOfBlockWeb = containMinedBockWeb(block_number) 
        if ( indexOfBlockWeb >= 0){
            html+="<td>"+stringToDate(minedBlockWeb[indexOfBlockWeb]["split_time"])+"</td>";
            html+="<td>" + minedBlockWeb[indexOfBlockWeb]["server"] + "</td>";
        } else{
            html+="<td> </td>";
            html+="<td> </td>";
        }

        var indexOfBlock = containMinedBock(block_number) 
        // console.log("block", block_number ," index:", indexOfBlock);

        if ( indexOfBlock >= 0){
        	html+="<td>"+stringToDate(minedBlock[indexOfBlock]["split_time"])+"</td>";
            
        } else{
        	
            html+="<td> </td>";
        }
        //miner

        if (rows[i]["miner"] == "t1RwbKka1CnktvAJ1cSqdn7c6PXWG4tZqgd"){

            html+="<td> Flypool </td>";
        } else{
            html+="<td>  </td>";
        }
        

        // if (rows[i]["poolInfo"]["poolName"] != undefined){

        // 	html+="<td> "+ rows[i]["poolInfo"]["poolName"] + "</td>";
        // } else{
        // 	html+="<td>  </td>";
        // }
        

        html+="</tr>";

    }
    html+="</table>";
    // $("div").html(html);
    document.getElementById("data").innerHTML = html;


}

function checkNumberMinedAble(){


    var availableBlockWeb = 0;

    for (var i = 0; i < rows.length; i++) {

        var block_number =  rows[i]["height"];
        
        if (rows[i]["miner"] != undefined){
        	if (rows[i]["miner"] == "t1RwbKka1CnktvAJ1cSqdn7c6PXWG4tZqgd"){


                var indexOfBlockWeb = containMinedBockWeb(block_number) 
                  // console.log("block", block_number ," index:", indexOfBlock);

                if ( indexOfBlockWeb == -1){
                    availableBlockWeb++;
    	        } 

            }

        }

    }


	document.title = availableBlockWeb + " block available";

	if (availableBlockWeb>2 && availableBlockWeb != currentBlockWeb){
		// notifyMe(availableBlock + " block available");
		newBlockSound.play();
	}

    currentBlockWeb = availableBlockWeb;

}

function setWalletAdress(){

    //t1VPH3WTYRbp3brp4xfqKZa613TFN53TJG4
    walletAddress = $('#input').val();
    console.log(walletAddress);

}

function getZecStatus(){

    if (walletAddress == ""){
        return;
    }

    var url = "https://api-zcash.flypool.org/miner/" + walletAddress + "/currentStats";

    httpGetAsync(url, function(response) {

        var json = JSON.parse(response);
        var data = json["data"];

        var balance  = data["unconfirmed"]
        document.getElementById("zec").innerHTML = balance/100000000;
        document.getElementById("zectobtc").innerHTML = balance/10000000*zecToBtc;
        // minedBlockWeb  = data;

         var currentZec = data["unpaid"];
	    if (currentZec != lastZec){
	        console.log(stringToDate(Date()));
	        console.log("Zec up: " + (currentZec - lastZec));
	        lastZec = currentZec;
	    } 


    });

}


function reloadAllData(){

	//reload data
	setTimeout( getMinedBlock, 11000 ); 
	//start countdown
	countDownTimer(10); 

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



function runWebTimer() {

    var timer = 0;

    if (typeof upTimerWeb !== 'undefined'){
        clearInterval(upTimerWeb);
    }

    upTimerWeb = setInterval(function () {

        timer++;
        var timeText = secondsToTime(timer);
        document.getElementById("web_time").innerHTML = timeText;
        document.title = currentBlockWeb + " block available - " + timeText;

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


var notify=[];

function notifyMe(notiMessage) {

  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {

   // notification.clear(NOTIFICATION_ID, function() {});


      for(var i=0; i<notify.length;i++){
        notify[i].close();                 //remove them all  
      }


        var notification = new Notification("From Batman:", {
          icon: 'images/nuts.png',//'https://z.cash/theme/images/yellow-zcash-logo.png',
          body:  notiMessage,
        });

        notification.onclick = function () {
            window.open("https://zcash.flypool.org/blocks");      
        };

        notify.push(notification);

    
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

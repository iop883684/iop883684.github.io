

var lastBlock = 0;
var lastZec = 0;
var zecToBtc = 0.0;
var message = "<br>";
var remainBalance = 0.0;

var currentSpeed = "";
var currentBlockWeb = 0;

var walletAddress = "";
var apiId = "";
var commandId = "";
var apiKey = "";
var currenLimit = 0.0001;

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

        if (newBLock.length>4){
            var minedBlockSound = new Audio('audio/msp.mp3');
            minedBlockSound.volume = 0.5;
            minedBlockSound.play();
        } else{
            var minedBlockSound = new Audio('audio/'+newBLock.length+'sp.mp3');
            minedBlockSound.volume = 0.5;
            minedBlockSound.play();
        }
		
        

        runWebTimer();
        notifyMe(newBLock.length + " block just split");

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

    zecToBtc = minedData["data"]["price"]["btc"];
    document.getElementById("btc").innerHTML =  minedData["data"]["price"]["btc"];
    document.getElementById("usd").innerHTML =  minedData["data"]["price"]["usd"];

    document.getElementById("hashRate").innerHTML =  minedData["data"]["poolStats"]["hashRate"];
    document.getElementById("miners").innerHTML =  minedData["data"]["poolStats"]["miners"];
    document.getElementById("workers").innerHTML =  minedData["data"]["poolStats"]["workers"];
    document.getElementById("blocksPerHour").innerHTML =  minedData["data"]["poolStats"]["blocksPerHour"];

}

function getMinedApiBlock(){


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
    //"https://api.zcha.in/v2/mainnet/blocks?sort=height&direction=descending&limit=12&offset=0"


    httpGetAsync("https://api.zcha.in/v2/mainnet/blocks?sort=height&direction=descending&limit=12&offset=0", function(response){

         var data = JSON.parse(response);
         var blocks = data;//["blocks"]
         var last =  blocks[0]["height"];

         if (last != lastBlock){
            // console.log("block time:", (Date.now() / 1000) - rows[0]["time"]);

            updateAllBlock(blocks);
            lastBlock = last;
            updateLayout();

        } 
        
        document.getElementById("status").innerHTML = "Done";

        reloadAllData();

        getZecStatus();
        updateLimit();
        getCommandStatus();

    });
        

}


function updateLayout(){

	if (typeof rows === 'undefined'){
		return;
	}

	var html = "<table border=' 1 |1'>";

	html+="<tr>";
    html+="<th>  Height  </th>";
    html+="<th> Mined time </th>";
    html+="<th>Split Web</th>";
    html+="<th> Split Api</th>";
    html+="<th> Mined by </th>";
    html+="</tr>";
        

    for (var i = 0; i < rows.length; i++) {
        
        html+="<tr>";

        var block_number =  rows[i]["height"];

        html+="<td>"+block_number+"</td>";
        html+="<td>"+timeStamToDate(rows[i]["time"])+"</td>";

        
        var indexOfBlockWeb = containMinedBockWeb(block_number) 
        if ( indexOfBlockWeb >= 0){
            html+="<td>"+stringToDate(minedBlockWeb[indexOfBlockWeb]["split_time"])+"</td>";
        } else{
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



    if (apiKey == "" || apiId == ""){
        document.title = availableBlockWeb + " block";
    } else{
        document.title = availableBlockWeb + " block - " + currentSpeed + " Msol/s";
    }

	if (availableBlockWeb != currentBlockWeb){

		currentBlockWeb = availableBlockWeb;
        updateLimit();

        if (availableBlockWeb>2 ){
            if (availableBlockWeb>10){
                var newBlockSound = new Audio('audio/mbl.mp3');
                newBlockSound.volume = 0.5;
                newBlockSound.play();
            } else{
                var newBlockSound = new Audio('audio/'+availableBlockWeb+'bl.mp3');
                newBlockSound.volume = 0.5;
                newBlockSound.play();
            }
            
        }
	}

   

}

function setWalletAdress(){

    //t1VPH3WTYRbp3brp4xfqKZa613TFN53TJG4
    walletAddress = $('#inputWallet').val();
    console.log(walletAddress);
    getZecStatus();


}

function getZecStatus(){

    if (walletAddress == ""){
        return;
    }

    var url = "https://api-zcash.flypool.org/miner/" + walletAddress + "/currentStats";

    httpGetAsync(url, function(response) {

        var json = JSON.parse(response);
        var data = json["data"];

        var balance  = data["unconfirmed"];
        document.getElementById("zec").innerHTML = balance/100000000;
        document.getElementById("zectobtc").innerHTML = balance/100000000*zecToBtc;

        var unpay  = data["unpaid"];
        document.getElementById("zecUnpay").innerHTML = unpay/100000000;
        document.getElementById("zectobtcUnpay").innerHTML = unpay/100000000*zecToBtc;

        // minedBlockWeb  = data;

         var currentZec = balance + unpay;

	    if (currentZec != lastZec){

            if (lastZec != 0){

                console.log(stringToDate(Date()) +" Zec up: " + (currentZec - lastZec));

                var me = '<br> <font color="#3366ff">';
                me += stringToDate(Date()) + " =>  balance change: "+ (currentZec - lastZec)/100000000*zecToBtc + " btc";
                me += '</font>';

                message = me + message;
                document.getElementById("message").innerHTML = message;

                var minedBlockSound = new Audio('audio/balanceChange.mp3');
                minedBlockSound.volume = 0.5;
                minedBlockSound.play();
            }

            lastZec = currentZec;
	        
	    } 


        document.getElementById("total").innerHTML = (unpay+balance)/100000000*zecToBtc + remainBalance;

    });

}

function setApiKey(){

    apiId = $('#inputApiId').val();
    apiKey = $('#inputApiKey').val();

    console.log(apiId);
    console.log(apiKey);
    getCommandStatus();

}

function setCommandId(){

    commandId = $('#commandId').val();
    console.log(commandId);
    updateLimit();

}



function updateLimit(){


    if (commandId == "" || apiKey == "" || apiId == ""){
        return;
    }


    var limit = 2;
    if (currentBlockWeb < 8){
        var config = [0.01, 0.01, 0.01, 0.1, 0.5, 1, 2, 2];
        limit = config[currentBlockWeb];

    }

    
    var date =  new Date();
    var minutes =  date.getMinutes()%10;
    var seconds = date.getSeconds();


    if (minutes == 2 || minutes == 6 || minutes == 7){
        // console.log("speed "+ limit);
    } else if ((minutes == 3 || minutes == 8) && seconds < 31){
        // console.log("speed "+ limit);
    } else{
        // console.log("speed limit "+ limit);
        limit = 0.01;
    }

    
    // if (minutes == 9 || minutes == 4 ){
    //     // console.log("speed "+ limit);
    // } else if ((minutes == 5 || minutes == 0) && seconds < 31){
    //     // console.log("speed "+ limit);
    // } else{
    //     // console.log("speed limit "+ limit);
    //     limit = 0.01;
    // }


    if (limit == currenLimit){
        return;
    }

    currenLimit = limit;

    var mi = "0" + minutes;
    var se = "0" + seconds;

    console.log(mi.substr(-2) + ":"+ se.substr(-2) +" - "+currentBlockWeb+" blocks, limit change: "+limit);
    
        
    var url = "api?method=orders.set.limit&id="+apiId+"&key="+apiKey+"&order="+commandId+"&limit="+limit;

    httpGetAsync(url, function(response) {

        var json = JSON.parse(response);
        var result = json["result"];
        if (result["error"] == undefined){
            console.log("success: "+result["success"]);
            toastr.success(result["success"]) 
        } else{
            toastr.error(result["error"]) 
            console.log("set limit error: "+result["error"]);
        }

    });

    var me = "<br>";
    me += '<font color="#ff6600">';
    me += stringToDate(Date()) + " => "+currentBlockWeb+" blocks, limit change: "+limit;
    me += '</font>';

    message = me + message;
    document.getElementById("message").innerHTML = message;
    

}

function getCommandStatus(){

    if (apiKey == "" || apiId == ""){
        return;
    }

    var url = "api?method=orders.get&id="+apiId+"&key="+apiKey;

    httpGetAsync(url, function(response) {

        var json = JSON.parse(response);
        var result = json["result"];
        // console.log(response);

        remainBalance = 0;

        if (result["error"] == undefined){
            var orders =  result["orders"]
            // console.log("orders: "+ orders);

            var htmlCommand = "<table border='1|1'>";

            htmlCommand+="<tr>";
            htmlCommand+="<th>  Id  </th>";
            htmlCommand+="<th> Price </th>";
            htmlCommand+="<th> Remain Btc </th>";
            htmlCommand+="<th> Miners </th>";
            htmlCommand+="<th> Speed(Msol/s) </th>";
            htmlCommand+="<th> Limit </th>";
            htmlCommand+="<th> Auto </th>";
            htmlCommand+="</tr>";

            for (var i = orders.length - 1; i >= 0; i--) {

                var order = orders[i];

                htmlCommand+="<tr>";

                htmlCommand += "<td>"+ order["id"] + "</td>"; 
                htmlCommand += "<td>"+ order["price"] + "</td>"; 
                htmlCommand += "<td>"+ order["btc_avail"] + "</td>"; 
                htmlCommand += "<td>"+ order["workers"] + "</td>"; 
                htmlCommand += "<td>"+ order["accepted_speed"]*1000 + "</td>"; 
                htmlCommand += "<td>"+ order["limit_speed"] + "</td>"; 

                remainBalance += parseFloat(order["btc_avail"]);

                if (order["id"] == commandId){
                    htmlCommand += "<td> Yes </td>"; 
                    currentSpeed = order["accepted_speed"]*1000
                    // console.log("remainBalance: " + remainBalance);
                } else{
                    htmlCommand += "<td> No </td>"; 
                }
                
                htmlCommand+="</tr>";
               
            }
            htmlCommand+="</table>";


             document.getElementById("orderList").innerHTML = htmlCommand;

        } else{
            console.log("get order error: "+result["error"]);
            toastr.error(result["error"]) 
        }


    });

}


function reloadAllData(){

	//reload data
	setTimeout( getMinedApiBlock, 31000 ); 
	//start countdown
	countDownTimer(30); 

}

setTimeout( getMinedApiBlock, 1000 ); 


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

        
        if (apiKey == "" || apiId == ""){
            document.title = currentBlockWeb + " block - " + timeText;
        } else{
            document.title = currentBlockWeb + " block - " + timeText + " - " + currentSpeed + " Msol/s";
        }
        
        

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


function convertToBtc(){

    var zecAmount = $('#zecToConvert').val();
    document.getElementById("btcAmount").innerHTML = zecAmount*zecToBtc;

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

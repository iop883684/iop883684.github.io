<?php
    
	
	if ($_GET["method"] == "orders.set.limit"){
		// header("Content-Type: application/json;charset=utf-8");
	    $url = 'http://api.nicehash.com/api?method='.$_GET["method"].'&id='.$_GET["id"].'&key='.$_GET["key"].'&location=1&algo=24&order='.$_GET["order"].'&limit='.$_GET["limit"];
	    $ch = curl_init(); 
	    curl_setopt($ch, CURLOPT_URL, $url); 
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		// curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.10 (KHTML, like Gecko) Chrome/8.0.552.224 Safari/534.10');

	    $output = curl_exec($ch); 
	    if(curl_error($ch))
		{

		    echo json_encode(array("result"=>array("error"=> curl_error($c))));
		    curl_close($ch);
		    return;

		}
	    echo $output; // hiển thị nội dung
	    curl_close($ch);

	} else if ($_GET["method"] == "orders.get"){

		 $url = 'http://api.nicehash.com/api?method='.$_GET["method"].'&id='.$_GET["id"].'&key='.$_GET["key"].'&location=1&algo=24&my';
	    $ch = curl_init(); 
	    curl_setopt($ch, CURLOPT_URL, $url); 
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		// curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.10 (KHTML, like Gecko) Chrome/8.0.552.224 Safari/534.10');

	    $output = curl_exec($ch); 
	    if(curl_error($ch))
		{

		    echo json_encode(array("result"=>array("error"=> curl_error($c))));
		    curl_close($ch);
		    return;

		}
	    echo $output; 
	    curl_close($ch);

	}

    


?>

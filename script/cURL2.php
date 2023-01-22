<?php

if (isset($_GET['msg'])){
        $id = $_GET['msg'];
}

$url = 'https://api.themoviedb.org/3/person/'. $id .'?api_key=231e9d893e9e83e5401d08b11efa34f1&language=en-US';

$api = curl_init($url);

curl_setopt_array($api, [
    CURLOPT_RETURNTRANSFER => true, 
    CURLOPT_TIMEOUT        => 1, 
]); 

$data = curl_exec($api);

echo $data;

curl_close($api);
?>
        
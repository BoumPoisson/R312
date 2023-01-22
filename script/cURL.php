<?php
$api = curl_init("https://api.themoviedb.org/3/movie/438631/credits?api_key=231e9d893e9e83e5401d08b11efa34f1&language=en-US");

curl_setopt_array($api, [
    CURLOPT_RETURNTRANSFER => true, 
    CURLOPT_TIMEOUT        => 1, 
]); 

$data = curl_exec($api);

// if ($data === false || curl_getinfo($api, CURLINFO_HTTP_CODE !== 200)) {
//     $data = null;
// }

echo $data;

curl_close($api);
?>
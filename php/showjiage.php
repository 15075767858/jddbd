<?php
include("simplehtmldom/simple_html_dom.php");

$m_url = 'http://jd.svipnet.com/list.php';
$name=$_REQUEST["name"];
echo $name."<br>";

$post_data = array ("shopName" => $name,"use" => "all","days"=>"90","numbers"=>"18");
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $m_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// post数据
curl_setopt($ch, CURLOPT_POST, 1);
// post的变量
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
$output = curl_exec($ch);
curl_close($ch);
//打印获得的数据
echo $output;
exit(0);
$html = str_get_html($output);
foreach($html->find('div') as $e)
    echo $e->innertext . '<br>';

<?php 
$t1 = microtime(true);  

//$url='https://dbditem.jd.com/services/currentList.action?paimaiIds=15489696-15489539-15489677-15490294-15490990-15491171-15491108-15491239-15491557-15491941-15492052-15492601-15492680-15492311-15491958-15491987-15492565-15492573-15492585-15493461-15493452-15493390-15493400-15493439-15493458-15493472&callback=showData&t=1496663855472&callback=jQuery3161076&_=1496663855473'; 
include_once('simplehtmldom/simple_html_dom.php'); 
$url ="http://dbditem.jd.com/15965761";

//$html = file_get_contents($url); 
$html = str_get_html(file_get_contents($url));
//echo $html; 
// foreach($html->find('div.name i') as $e)
//     {
//         echo $e->innertext . '<br>';
//     }

$i = $html->find('div.name i');
if($i){
echo $i[0]->innertext;
}
$divname = $html->find('div.name');
if($divname){
    echo $divname[0].getAttribute("title");
}

exit();
$t2 = microtime(true); 
echo ($t2-$t1)*1000;

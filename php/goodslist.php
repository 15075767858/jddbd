<?php
include("simplehtmldom/simple_html_dom.php");

$m_url = 'https://dbd.jd.com/auctionList.html?searchParam=surface%20%20Mac&enc=utf-8';
$html=new simple_html_dom();
$html->load_file($m_url);
$html->find(".name a");
echo $html;
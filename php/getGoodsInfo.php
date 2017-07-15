//爬取所有的商品信息
<?php 
$mysqlConfigXmlPath = "./mysqlconfig.xml";
$xml = simplexml_load_string(file_get_contents($mysqlConfigXmlPath));
$host = $xml->host;
$username = $xml->username;
$password = $xml->password;
$databasename = $xml->databasename;

$mysql = mysqli_connect($host, $username, $password);
mysqli_select_db($mysql, $databasename);


$par=$_REQUEST['par'];


if($par=="getInfos"){
    file_get_contents("http://dbditem.jd.com/15965761");
}
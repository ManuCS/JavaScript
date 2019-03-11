<?php
$usuario = $_POST['usuario'];
$tiempo = $_POST['tiempo'];
$movimientos = $_POST['movimientos'];
$f = fopen("ranking.txt","a");
fputs($f, $usuario.";".$tiempo. ";". $movimientos . "|");
fclose($f);
?>
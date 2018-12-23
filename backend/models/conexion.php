<?php

class Conexion{

	public function conectar(){

		$link = new PDO("mysql:host=localhost;dbname=espaciosmx","root","");
		return $link;
        
        /*$link = new PDO("mysql:host=localhost;dbname=zamopad0_luna2018","zamopad0_luna2018","lun42018@");
		return $link;*/

	}

}
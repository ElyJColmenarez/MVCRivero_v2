<?php
/**
 * PostGet.php - Componente de MVCRIVERO.
 *
 * manejoErrores.php - Componente de MVCRIVERO.
 *
 * 
 * @copyright 2014 - Instituto Universtiario de Tecnología Dr. Federico Rivero Palacio
 * @license GPLv3
 * @license http://www.gnu.org/licenses/gpl-3.0.html
 *
 *
 * @author Johan Alamo (johan.alamo@gmail.com)
 * 
 * @package Componentes
 */

abstract class PostGet {
    
    /**Función que permite colocar todos los índices de los arreglos
     * $_POST y $_GET en minúscula, esto para evitar problemas al momento
     * de pasar la información por alguno de los métodos post y/o get
     */
     
     	/**
		 * Función que permite colocar todos los índices de los arreglos
		 * $_POST y $_GET en minúscula, esto para evitar problemas al momento
		 * de pasar la información por alguno de los métodos post y/o get.
		 *
		 */
    public static function colocarIndicesMinuscula(){
		foreach($_POST as $clave => $valor)
			$_POST[strtolower($clave)] = $valor;
		foreach($_GET as $clave => $valor)
			$_GET[strtolower($clave)] = $valor;
	}
    
    
	/**función que permite obtener un valor del arreglo POST y/o GET
	  dándole prioridad al arreglo POST
	   Parámetros de entrada:
	     $indice: índice en donde se buscará el valor
	   Valor de retorno:
	     - el valor de la posición en caso de existir
	     - null en caso de no existir
	*/
	
	/**
	 * Función que permite obtener un valor del arreglo POST y/o GET
	 * dándole prioridad al arreglo POST get.
	 * 
	 * @param String $indice 		Nombre del dato que se quiere buscar.
	 *
	 * @return Data              	Información que se encuentra en la posición.
	 */
    public static function obtenerPostGet($indice){
		//en primer lugar revisa el arreglo $_POST
        $valor = PostGet::obtenerPost($indice);
		//si no encuentra en POST busca en GET
		if (is_null($valor))
			$valor = PostGet::obtenerGet($indice);
        //retorna lo encontrado
        return $valor;
    }

   
	
	/**
	 *función que permite obtener un valor del arreglo POST
	 * 
	 * @param String $indice 		Nombre del dato que se quiere buscar.
	 *
	 * @return Data              	Información que se encuentra en la posición.
	 */
    public static function obtenerPost($indice){
        return isset($_POST[$indice]) ?   $_POST[$indice]: null;
    }


		/**
	 *función que permite obtener un valor del arreglo GET
	 * 
	 * @param String $indice 		Nombre del dato que se quiere buscar.
	 *
	 * @return Data              	Información que se encuentra en la posición.
	 */
    public static function obtenerGet($indice){
        return isset($_GET[$indice]) ?   $_GET[$indice]: null;
    }
}
?>

<?php
/**
 * InstalacionServicio.php - Servicio del módulo Instalación.
 *
 * Esta clase ofrece el servicio de conexión a la base de datos, recibe 
 * los parámetros, ejucuta las funciones PLPSQL correpsondientes, hace las peticiones a 
 * la base de datos y retorna los objetos o datos correspondientes a la
 * acción. Todas las funciones de esta clase relanzan las excepciones si son capturadas.
 * Esto con el fin de que la clase manejadora de errores las capture y procese.
 * Esta clase trabaja en conjunto con la clase Conexion.
 *
 * @copyright 2016 - Instituto Universtiario de Tecnología Dr. Federico Rivero Palacio
 * @license GPLv3
 * @license http://www.gnu.org/licenses/gpl-3.0.html
 *
 *
 * @link base/clases/utilitarias/errores/manejoErrores.php 		Clase manejadora de errores.
 * 
 * @link /base/clases/conexion/Conexion.php 	Clase Conexion
 *  
 * @author Geraldine Castillo (geralcs94@gmail.com)
 * @author Jhonny Vielma      (jhonnyvq1@gmail.com)
 * @author Johan Alamo (lider de proyecto) <johan.alamo@gmail.com>
 * 
 * @package MVC
 */
class InstalacionServicio{

	/**
	 * Método que permite ejecutar un script .sql.
	 *
	 * Método que permite ejecutar un archivo .sql, recibe por parámetro la ruta del archivo 
	 * y el separador que son los caracteres que debe posee el archivo entre cada sql para ejecutarlas
	 * por separado.
	 *
	 * @param String $ruta 			 Ruta del archivo.
	 * @param string $separado 	     Separador por el cual están separadas los sql en el archivo. 
	 *						
	 * @throws Exception 					Si el archivo no existe y relanza las excepciones de postgres.
	 */
	 public static function ejecutarScript($ruta,$separador="--"){
	 	try{
			if(file_exists($ruta)){
				$arch=fopen($ruta, "r");
				$cont=0;
				$linea="";
				while (!feof($arch)){
					$linea.=fgets($arch);
				}				
			}else{
				new Exception ("no existe el archivo ".$ruta);
			}
			$arreglo=explode($separador,$linea);
			foreach ($arreglo as &$valor) 
				self::ejecutarConsulta($valor);
		}catch(Exception $e){
			throw $e;
		}
	}
	/**
	 * Método que permite ejecutar una consulta o sentencia sql.
	 *
	 * Método privado que permite ejecutar una sentencia sql, recibe por parámetro la sentencia a ejecutar.
	 *
	 * @param String $consulta 		 Sentecia a ejecutar.					
	 *
	 * @throws Exception 			Relanza las excepciones de postgres.
	 */	
	private static function ejecutarConsulta($consulta){
		try{		
			$conexion=Conexion::conectar();
			$ejecutar = $conexion->prepare($consulta);
			$ejecutar->execute();
		}catch(Exception $e){
			throw $e;
		}
	}
		 
	/**
	 * Método que permite verificar conexión a base de datos.
	 *
	 * Método publico que permite verificar que todos los parámetros de conexión establecidos en 
	 * el objeto de Conexión estén correctos.					
	 *
	 * @throws Exception 			No hubo conexión y Relanza las excepciones de postgres.
    */		 
	public static function priConexion(){
		try{				
			$conexion=Conexion::conectar();		
		}catch (Exception $e ){
			throw $e;
		}	
	}
	/**
	 * Método que permite crear una base de datos.
	 *
	 * Método publico que permite crear una base de datos con el nombre y codificación
	 * de caracteres pasados por parámetro.					
	 *
	 * @param String $nomBasDeDatos 	Nombre de la base de datos a crear.
	 * @param String $codificacion 	    Codificación de caracteres con el que se creara la base de datos.
	 *	
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */		
	public static function creBasDeDatos($nomBasDeDatos,$codificacion){
		try{
			$conexion=Conexion::conectar();
			$consulta="CREATE DATABASE ".$nomBasDeDatos."
 						WITH
     					ENCODING ='".$codificacion."'
 					 CONNECTION LIMIT=-1;";
			$ejecutar = $conexion->prepare($consulta);
			$ejecutar->execute();
		}catch(Exception $e){
			throw $e;
		}
	}
	/**
	 * Método que permite asignar el dueño de  base de datos.
	 *
	 * Método publico que permite asignarle un dueño a una base de datos,
	 * para ejecutar esta función debe asegurarse que el usuario con el que esta conectado
	 * pose permisos de superUser					
	 *
	 * @param String $nomBasDeDatos 	Nombre de la base de datos a asignar dueño.
	 * @param String $usuario    	    Usuario que se asignara como dueño.
	 *	
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */		
	public static function asiDueBasDatos($nomBasDeDatos,$usuario){
		try{
			$conexion=Conexion::conectar();
			$consulta="select per.f_asi_due_bas_datos(:nomBasDatos, :usuario)";
			$ejecutar=$conexion->prepare($consulta);
			$ejecutar->bindParam(':nomBasDatos',$nomBasDeDatos, PDO::PARAM_STR);
			$ejecutar->bindParam(':usuario',$usuario, PDO::PARAM_STR);
			$ejecutar->execute();
		}catch(Exception $e){
			throw $e;
		}
	}
	/**
	 * Método que permite crear los schema.
	 *
	 * Método publico que permite crear los schema(per,sis,err,aud) de base de datos
	 *
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */	
	public static function creSchemas(){
		try{
			$conexion=Conexion::conectar();
			$consulta="select  f_cre_schemas()";
			$ejecutar=$conexion->prepare($consulta);
			$ejecutar->execute();
		}catch(Exception $e){
			throw $e;
		}
	}
	/**
	 * Método que permite crear  las tablas de schema sis.
	 *
	 * Método publico que permite crear las tablas del schema sis, el cual
	 * sera el modulo de prueba del framework.
	 *
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */	
	public static function creTabSchSistema(){
		try{		
			$conexion=Conexion::conectar();
			$consulta="select  sis.f_cre_tab_instituto()";
			$ejecutar=$conexion->prepare($consulta);
			$ejecutar->execute();
		}catch(Exception $e){	
			throw $e;
		}
	}
	
	public static function creTabSchError(){
		try{		
			$conexion=Conexion::conectar();
			$consulta="select  err.f_cre_tab_error()";
			$ejecutar=$conexion->prepare($consulta);
			$ejecutar->execute();
			$consulta="select err.f_cre_tab_est_error()";
			$ejecutar=$conexion->prepare($consulta);
			$ejecutar->execute();
		}catch(Exception $e){	
			throw $e;
		}
	}
	/**
	 * Método que permite crear  las tablas de schema per.
	 *
	 * Método publico que permite crear las tablas del schema per, el cual
	 * es el schema donde se encuentra la permisología del framework.
	 *
	 * @param Object $instalacion 	Objeto instalación.
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */	
	public static function creTabSchPermiso($instalacion){
		try{
			$conexion=Conexion::conectar();		
			$tipUsuario=$instalacion->obtenerUsuBD();
			$consulta="select per.f_cre_tab_sch_permiso(:tipUsuario)";
			$ejecutar=$conexion->prepare($consulta);
			$ejecutar->bindParam(':tipUsuario',$tipUsuario, PDO::PARAM_STR);
			$ejecutar->execute();
		}catch(Exception $e){	
			throw $e;
		}
	}
	/**
	 * Método que permite asignarle el dueño a un schema.
	 *
	 * Método publico que permite asignar el dueño a un schema, 
	 * los cuales se pasan por parámetro.
	 *
	 * @param String $usuario 	        Usuario que sera dueño del schema.
	 * @param String $schema    	    schema al cual se le cambiara dueño.
	 *
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */	
	public static function asiUsuDueSchema($usuario,$schema){
		try{
			$conexion=Conexion::conectar();		
			$consulta="select per.f_cambiar_dueño_schema(:usuario,:schema)";
			$ejecutar=$conexion->prepare($consulta);
			$ejecutar->bindParam(':usuario',$usuario, PDO::PARAM_STR);
			$ejecutar->bindParam(':schema',$schema, PDO::PARAM_STR);
			$ejecutar->execute();
		}catch(Exception $e){	
			throw $e;
		}
	}
	/**
	 * Método que permite asignarle dueño a los schema de la base de datos.
	 *
	 * Método publico que permite asignar como dueño al usuario pasado por parámetro
	 * a todos los schema que posee la base de datos de la aplicación.
	 *
	 * @param String $usuario 	        Usuario que sera dueño de los  schema.
	 *
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */		
	public static function asiUsuDueSchemas($usuario){
		try{
			self::asiUsuDueSchema($usuario,"per");
			self::asiUsuDueSchema($usuario,"sis");
			self::asiUsuDueSchema($usuario,"err");
			self::asiUsuDueSchema($usuario,"aud");
		}catch(Exception $e){	
			throw $e;
		}
	}
	/**
	 * Método que permite colocar la secuencia PUBLIC.
	 *
	 * Método publico que permite colocar una secuencia como PUBLIC para 
	 * el acceso a ella de cualquier usuario.
	 *
	 * @param String $secuencia 	        Secuencia a colocar PUBLIC.
	 *
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */	
	public static function asiPerSecuencia($secuencia){
		try{
			$conexion=Conexion::conectar();		
			$consulta="select per.f_asi_per_secuencia(:secuencia)";
			$ejecutar=$conexion->prepare($consulta);	
			$ejecutar->bindParam(':secuencia',$secuencia, PDO::PARAM_STR);
			$ejecutar->execute();
		}catch(Exception $e){	
			throw $e;
		}
	}
	/**
	 * Método que permite colocar las secuencias PUBLIC.
	 *
	 * Método publico que permite colocar todas las secuencias creadas en la base de datos
	 * por el framework en PUBLIC para el acceso de libre de los usuarios a estas.
	 *
	 * @param String $tipoUsuario 	    Tipo de usuarios de la aplicación.
	 *
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */	
	public static function asiPerSecuencias($tipoUsuario){
		try{
			self::asiPerSecuencia("per.s_usuario");
			if ($tipoUsuario!="false"){
				self::asiPerSecuencia("per.s_tabla");
				self::asiPerSecuencia("per.s_tab_accion");
			}
			self::asiPerSecuencia("per.s_modulo");
			self::asiPerSecuencia("per.s_accion");
			self::asiPerSecuencia("per.s_acc_usuario");
			self::asiPerSecuencia("sis.s_instituto");
		}catch(Exception $e){	
			throw $e;
		}
	}
	/**
	 * Método que permite colocar un schema PUBLIC.
	 *
	 * Método publico que permite colocar un schema como PUBLIC para 
	 * el acceso a ella de cualquier usuario.
	 *
	 * @param String $schema 	        Schema a colocar PUBLIC.
	 *
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */	
	public static function asiPerSchema($schema){
		try{
			$conexion=Conexion::conectar();		
			$consulta="select per.f_asi_per_esquemas(:schema)";
			$ejecutar=$conexion->prepare($consulta);
			$ejecutar->bindParam(':schema',$schema, PDO::PARAM_STR);
			$ejecutar->execute();
		}catch(Exception $e){	
			throw $e;
		}
	}
	/**
	 * Método que permite colocar los schema PUBLIC.
	 *
	 * Método publico que permite colocar todos los schema creados en la base de datos
	 * por el framework en PUBLIC para el acceso de libre de los usuarios a estas.
	 *
	 *
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */	
	public static function asiPerSchemas(){
		try{		
			self::asiPerSchema("per");
			self::asiPerSchema("sis");
			self::asiPerSchema("err");
			self::asiPerSchema("aud");
		}catch(Exception $e){	
			throw $e;
		}
	}
	/**
	 * Método que permite asignarle el dueño a una secuencia.
	 *
	 * Método publico que permite asignar el dueño a una secuencia, 
	 * los cuales se pasan por parámetro.
	 *
	 * @param String $usuario 	        Usuario que sera dueño de la secuencia.
	 * @param String $sequence    	    secuencia a la cual cual se le cambiara dueño.
	 *
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */	
	public static function asiUsuDueSequence($usuario,$sequence){
		try{
			$conexion=Conexion::conectar();		
			$consulta="select per.f_cambiar_dueño_sequences(:usuario,:sequence)";
			$ejecutar=$conexion->prepare($consulta);
			$ejecutar->bindParam(':usuario',$usuario, PDO::PARAM_STR);
			$ejecutar->bindParam(':sequence',$sequence, PDO::PARAM_STR);
			$ejecutar->execute();
		}catch(Exception $e){	
			throw $e;
		}
	}
	/**
	 * Método que permite colocar asignar dueño a las secuencias.
	 *
	 * Método publico que permite  asignarle dueño a todas las secuencias
	 * creadas por el framwork.
	 *
	 * @param String $usuario 	        Usuario que sera dueño de las secuencias.
	 * @param String $tipoUsuario 	    Tipo de usuarios de la aplicación.
	 *
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */		
	public static function asiUsuDueSequences($usuario,$tipoUsuario){
		try{
			self::asiUsuDueSequence($usuario,"per.s_usuario");
			if ($tipoUsuario!="false"){
				self::asiUsuDueSequence($usuario,"per.s_tabla");
				self::asiUsuDueSequence($usuario,"per.s_tab_accion");
			}
			self::asiUsuDueSequence($usuario,"per.s_modulo");
			self::asiUsuDueSequence($usuario,"per.s_accion");
			self::asiUsuDueSequence($usuario,"per.s_acc_usuario");
			self::asiUsuDueSequence($usuario,"sis.s_instituto");
		}catch(Exception $e){	
			throw $e;
		}
	}
	/**
	 * Método que permite asignar institutos en la base de datos.
	 *
	 * Método publico que permite insertar institutos a la base de datos para 
	 * el modulo de prueba.
	 *
	 * @throws Exception 			    Relanza las excepciones de postgres.
    */	
	static public function insInstitutos(){
		try{
			$conexion=Conexion::conectar();
			$consulta="select per.f_instituto_cargar()";
			$ejecutar=$conexion->prepare($consulta);
			$ejecutar->execute();
		}catch(Exception $e){	
			throw $e;
		}
	}
}
?>

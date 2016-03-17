<?php

/**
 * PrincipalControlador.php - Componente de MVCRIVERO.
 * 
 * Este es el controlador principal del MVC, aquí se obtendrá el módulo a trabajar para luego llamar al controlador 
 * correspondiente a ese módulo y que éste continúe con el trabajo obteniendo la acción y los parámetros a manejar. 
 * Al MVC se le puede enviar la información tanto por POST o por GET, por ello se usar la clase PostGet a través del método obtenerPostGet(indice). 	
 * ejemplo: PostGet::obtenerPostGet('modulo')
 *
 * @copyright 2016 - Instituto Universtiario de Tecnología Dr. Federico Rivero Palacio
 * @license GPLv3
 * @license http://www.gnu.org/licenses/gpl-3.0.html
 *
 *
 * @author JOHÁN ALÁMO (geralcs94@gmail.com)
 * @author GERALDINE CASTILLO (geralcs94@gmail.com)
 * @author JHONNY VIELMA 	  (jhonnyvq1@gmail.com)
 * 
 * @package MVC
 *
 *
 * @link  modulos/login/LoginControlador.php  				  Controlador del modulo Login.
 * @link  base/clases/utilitarias/PostGet.clase.php 	      Clase Utilitaria POSTGET.
 * @link  base/clases/utilitarias/Util.clase.php 	  		  Clase Utilitaria Util.
 * @link  base/clases/basededatos/Conexion.php 	   			  Clase Conexión.
 * @link  negocio/Sesion.php  							      Clase Sesion.
 * @link  negocio/Usuario.php       						  Objeto Usuario.
 * @link  negocio/Instalacion.php                             Objeto Instalación. 
 * @link  base/clases/vista/Vista.php                         Objeto Vista.           
 */

require_once 'modulos/login/LoginControlador.php';
require_once 'base/clases/utilitarias/PostGet.clase.php';
require_once 'base/clases/utilitarias/Util.clase.php';
require_once 'base/clases/basededatos/Conexion.php';
require_once 'negocio/Sesion.php';
require_once 'negocio/Usuario.php';
require_once'negocio/Instalacion.php';
require_once 'base/clases/vista/Vista.php';
 /** @var Instalacion|null Variable Global para administrar la instalación */
$instalacion;
class PrincipalControlador {
	
	/**
	 * Método público que llama a las funciones configurar()  y manejarRequerimiento().
	 * 
	 * Método público que llama a las funciones configurar()  y manejarRequerimiento()
	 * Es llamado desde el index de la aplicación e 	inicia el flujo del sistema.
     * 
	 * 
	 * @throws Exception 			No lanza exceptiones.
	 * 
	 */
	public static function iniciar(){

		self::configurar();
		self::manejarRequerimiento();
	}    

	
	/**
	 * método privado que permite configurar la aplicación. El 	algoritmo de este método es el siguiente:.
	 * 
     * 1- En este método está  incluido  la  verificación de la sesión . Si hay usuario logueado  y el módulo es igual a 
     * null colocará como predeterminado el módulo pesum. Cuando no hay una sesión iniciada y hay un usuario en proceso 
     * de logueo, procederá con el flujo normal hacia la verificación del usuario ; pero si no hay usuario en proceso de logueo 
     * y el módulo es distinto de login redireccionará a la pantalla de autentificación de datos.
     * 2- Obtiene el módulo, acción, formato y vista mediante el objeto clase estática PostGet a través del método obtenerPostGet(indice).
     *  Ejemplo: PostGet::obtenerPostGet('m_modulo');
     * 3. Se hace la conexión a la base de datos (y se guarda en un objeto global para ser utilizado desde cualquier módulo).
     * 4. Crear e instanciar el  objeto vista al cual se le asignará el formato,que pueden ser: html5, txt, json etc. Asignar scripts 
     * y css que se utilizarán en toda la aplicación, asignar la dirección de la vista que mostrará la información y por último asignar
     * el módulo con la letra inicial en mayúscula..
     * 
	 * 
	 * @throws Exception 			No lanza exceptiones.
	 * 
	 */
        
	private static function configurar(){
		

		//colocar todas las claves de los arreglos $_POST y $_GET en 
		Sesion::iniciarSesion();

		if(PostGet::obtenerPostGet('m_modulo')== null){
				 $_POST['m_modulo'] = 'principal';
				 $_POST['m_accion'] = 'inicio';
				 $_POST['m_formato'] = 'html5';
				 $_POST['m_vista'] = 'Inicio';
		}
		if (!Sesion::hayUsuarioLogueado()){
			if (is_null(PostGet::obtenerPostGet('m_modulo'))){
				$_POST['m_modulo'] = 'login';
				$_POST['m_accion'] = 'mostrar';
				$_POST['m_formato'] = 'html5';
				$_POST['m_vista'] = 'Inicio';
			}
		}	
		if ((manejoErrores::existeArchivo("config.ini")!=true) &&(PostGet::obtenerPostGet('m_modulo')!="instalacion")){
				$_POST['m_modulo'] = 'instalacion';
				 $_POST['m_accion'] = 'comInstalacion';
				 $_POST['m_formato'] = 'html5';
				 $_POST['m_vista'] = 'Instalar';
				 Sesion::cerrarSesion();
		}
		
		if (manejoErrores::existeArchivo("config.ini")==true){
			global $instalacion;
			$instalacion= new Instalacion();
			$instalacion->obtenerInstalacionIni();

			vista::asignarDato("instalacion",$instalacion);
		}
		
		PostGet::colocarIndicesMinuscula();
		$modulo=PostGet::obtenerPostGet('m_modulo');
		$formato=PostGet::obtenerPostGet('m_formato');
		$vista=PostGet::obtenerPostGet('m_vista');
		
		if (Sesion::hayUsuarioLogueado()){
			if ($instalacion->obtenerUsuBD()=="false")
				Conexion::iniciar($instalacion->obtenerServidor(),$instalacion->obtenerNombreBD(),$instalacion->obtenerPuerto(),$instalacion->obtenerUsuarioAdmin(),$instalacion->obtenerPassAdmin());
			else{
				$login=Sesion::obtenerLogin();
				Conexion::iniciar($instalacion->obtenerServidor(),$instalacion->obtenerNombreBD(),$instalacion->obtenerPuerto(),$login->obtenerUsuario(),$login->obtenerClave());
			}
			LoginControlador::restaurarPermisos();
			vista::asignarDato("login",Sesion::obtenerLogin());
			Vista::asignarDato("usuBD",$instalacion->obtenerUsuBD());

		}
		else{
			if ((PostGet::obtenerPostGet('m_modulo')=="login")&&(PostGet::obtenerPostGet('m_accion')=="iniciar")){
				if ($instalacion->obtenerUsuBD()=="false")
					Conexion::iniciar($instalacion->obtenerServidor(),$instalacion->obtenerNombreBD(),$instalacion->obtenerPuerto(),$instalacion->obtenerUsuarioAdmin(),$instalacion->obtenerPassAdmin());
				else 
					Conexion::iniciar($instalacion->obtenerServidor(),$instalacion->obtenerNombreBD(),$instalacion->obtenerPuerto(),PostGet::obtenerPostGet('usuario'),PostGet::obtenerPostGet('pass'));
			}
		}
		Vista::iniciar($modulo.":".$formato.":".$vista);

	}

	
	/**
	 * Método privado  que permite manejar el 	requerimiento (o acción).
	 * 
     * Método privado  que permite manejar el 	requerimiento (o acción) indicado por  el usuario según su petición.
	 * Si el módulo es login, instituto ó pensum  se irá al controlador correspondiente llamando a la función iniciar
	 * y realizará el flujo pertinente 	a la petición del usuario.
     * 
	 * 
	 * @throws Exception 			No lanza exceptiones.
	 * 
	 */
    private static function manejarRequerimiento() {
		//se obtiene el modulo a trabajar del arreglo POST y/o GET
		
		// y convertirlo a minuscula
		try {
		$modulo = strtolower(PostGet::obtenerPostGet('m_modulo'));
		if ($modulo==null)
			$modulo="instituto";
			
		if ($modulo=='instituto'){
			require_once ("modulos/instituto/InstitutoControlador.php");
			InstitutoControlador::manejarRequerimiento();
		}
		else if($modulo == 'error'){
			require_once ("modulos/error/ErrorControlador.php");
			ErrorControlador::manejarRequerimiento();
		}elseif ($modulo == 'instalacion'){
		    require_once 'modulos/instalacion/InstalacionControlador.php';
		    InstalacionControlador::manejarRequerimiento();
		}elseif ($modulo == 'principal')
		    PrincipalControlador::inicio();
		elseif ($modulo == 'login'){
		    LoginControlador::manejarRequerimiento();
		}elseif($modulo == 'accion'){
			require_once 'modulos/accion/AccionControlador.php';
			AccionControlador::manejarRequerimiento();
		}elseif($modulo == 'modulo'){
			require_once 'modulos/modulo/ModuloControlador.php';
			ModuloControlador::manejarRequerimiento();
		}elseif($modulo == 'tabla'){
			require_once 'modulos/tabla/TablaControlador.php';
			TablaControlador::manejarRequerimiento();
		}elseif($modulo == 'usuario'){
			require_once 'modulos/usuario/UsuarioControlador.php';
		
			UsuarioControlador::manejarRequerimiento();

		}else
			throw new Exception ("(PrincipalControlador) Módulo inválido: $modulo<br>");
		}catch (Exception $e){
				throw $e;
		}
    }

	/*Método privado que permite manejar las acciones del 	MVC generales.

 	*'phpinfo': ver la información de configuración de php .
	*'crearclase': permite crear un archivo con el código fuente de una clase. 
	ejemplos: 
		url: index.php?modulo=principal&accion=phpinfo 
		url:index.phpmodulo=principal&accion=crearclase&nombreclase=Fraccion&atributos=numerador,denominador  	 
	*/
	
	/**
	 * Método privado que permite manejar las acciones del 	MVC generales.
	 * 
     *'phpinfo': ver la información de configuración de php .
	 *'crearclase': permite crear un archivo con el código fuente de una clase. 
	 * ejemplos: 
	 *	url: index.php?modulo=principal&accion=phpinfo 
	 *	url:index.phpmodulo=principal&accion=crearclase&nombreclase=Fraccion&atributos=numerador,denominador  
     * 
	 * 
	 * @throws Exception 			No lanza exceptiones.
	 * 
	 */
	
	private static function manejarAccion(){
		$accion = PostGet::obtenerPostGet('m_accion');
			
		if ($accion=='phpinfo')
			phpinfo();
		elseif ($accion=='crearclase')
			Util::crearClase(PostGet::obtenerPostGet('nombreclase'),  PostGet::obtenerPostGet('atributos'));
		elseif($accion=='documentacion') {
			global $gbVista;
			$gbVista->mostrar();	
		}elseif($accion=='documentacionmarcotrabajo') {
			header("location:base/documentacion/MarcoTrabajo.html");;
		}else  //Da el mensaje de acción inválida para orientar al programador
			echo "Acción inválida en el módulo principal: $accion<br>";
	}
	/**
	 * Método publico que permite mostrar la pantalla principal.
	 *  
     * Metodo que permite mostrar la pantalla principal del framework.
	 * 
	 * @throws Exception 			No lanza exceptiones.
	 * 
	 */
	public static function inicio(){
		Vista::mostrar();
	}	
}

?>

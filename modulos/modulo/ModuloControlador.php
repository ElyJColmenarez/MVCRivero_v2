<?php
/**
* ModuloControlador.php - Controlador del módulo modulo.
*	
* Este es el controlador del módulo modulo, permite manejar las 
* operaciones relacionadas con los modulos(agregar, modificar,
* eliminar, consultar y buscar), es el intermediario entre la base de datos y la vista. 
* @copyright 2016 - Instituto Universtiario de Tecnología Dr. Federico Rivero Palacio
* @license GPLv3
* @license http://www.gnu.org/licenses/gpl-3.0.html
*
* @author GERALDINE CASTILLO (geralcs94@gmail.com)
* @author JHONNY VIELMA 	  (jhonnyvq1@gmail.com)
* @author Johan Alamo (lider de proyecto) <johan.alamo@gmail.com>
* 
* @package MVC
*/
require_once "modulos/modulo/modelo/ModuloServicio.php";
require_once "negocio/Modulo.php";

class ModuloControlador{

	/**
	 * Método que permite manejar las acciones relacionadas a este módulo obteniendolas por POST o GET.
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 *
	 * @throws Exception 					En caso de acción no reconocida por el módulo.
	 */

	public static function manejarRequerimiento(){

			//permite obtener la acción a realizar en este módulo
			$accion = PostGet::obtenerPostGet('m_accion');
			$usuario=Sesion::obtenerLogin();
			if($usuario==null)
				throw new exception ("No podrá realizar ninguna operación sin antes loguearse, inicie sesión.");
			//permite colocar una acción predefinida en caso de no colocarla
			if ( ! $accion)
				$accion = 'filtrar';
				
			
		    if ($accion == 'agregar')	{
				if($usuario->obtenerPermiso("ModuloAgregar"))
					self::agregar();
				else 
					throw new exception ("Permiso denegado para agregar módulos, revise sus privilegios o contacte al administrador.");
			}else if ($accion == 'obtener')	{
				if($usuario->obtenerPermiso("ModuloListar"))
					self::obtener();
				else 
					throw new exception ("Permiso denegado para obtener módulos, revise sus privilegios o contacte al administrador.");
			}else if ($accion == 'modificar'){
				if($usuario->obtenerPermiso("ModuloModificar"))
					self::modificar();
				else 
					throw new exception ("Permiso denegado para modificar módulos, revise sus privilegios o contacte al administrador.");
			}else if ($accion == 'eliminar'){
				if($usuario->obtenerPermiso("ModuloEliminar"))
					self::eliminar();
				else 
					throw new exception ("Permiso denegado para eliminar módulos, revise sus privilegios o contacte al administrador.");
			}else if ($accion == 'filtrar'){
				if(($usuario->obtenerPermiso("ModuloListar"))||($usuario->obtenerPermiso('AccionAgregar')) ||($usuario->obtenerPermiso('AccionModificar')))
					self::filtrar();
				else 
					throw new exception ("Permiso denegado para listar módulos, revise sus privilegios o contacte al administrador.");
			}
			else
				throw new exception ("Acci&oacute;n inv&aacute;lida: $accion en el m&oacute;dulo módulo ");
	} 
	
	/**
	 * Método que permite agregar un módulo a través de los parámtros obtenidos por POST o GET. 
	 * por medio del servicio de modulo.
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 * @throws  No lanza excepción.
	 */
	private static function agregar() {
		try{
			$modulo = new Modulo();
			$modulo->asignarNombre(PostGet::obtenerPostGet('nombre'));
			$modulo->asignarDescripcion(PostGet::obtenerPostGet('descripcion'));
			
			$codigo=ModuloServicio::agregar($modulo);
		
			
			Vista::asignarDato('codModulo',$codigo);
			Vista::asignarDato('mensaje','Se ha agregado el módulo '.$modulo->obtenerNombre());
			Vista::asignarDato('estatus',1);
			Vista::mostrar();
		}catch(Exception $e){
			throw $e;	
		}
	}
	/**
	 * Método que permite obtener los módulos de la tabla t_modulo a través de su código obtenido por
	 * POST o GET. 
	 *
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 * @throws  No lanza excepción.
	 */

	private static function obtener(){
		try{
			$codigo=PostGet::obtenerPostGet('codigo');
		 	$modulo=ModuloServicio::obtener($codigo);
		 	
			Vista::asignarDato('estatus',1);
			Vista::asignarDato('modulo',$modulo);
			Vista::mostrar();
		}catch(Exception $e){
			throw $e;	
		}
	}
	/**
	 * Método que permite modificar un módulo a través de su código obtenido por el POST o GET. 
	 *
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 * @throws  No lanza excepción.
	 */
	
	private static function modificar() {
		try{
		 
			$modulo = new Modulo();
			$modulo->asignarNombre(PostGet::obtenerPostGet('nombre'));
			$modulo->asignarCodigo(PostGet::obtenerPostGet('codigo'));
			$modulo->asignarDescripcion(PostGet::obtenerPostGet('descripcion'));
			ModuloServicio::modificar($modulo);
			Vista::asignarDato('codigo',$modulo->obtenerCodigo());
			Vista::asignarDato('estatus',1);
			Vista::asignarDato('mensaje','Se ha modificado el módulo '.$modulo->obtenerNombre());
			Vista::mostrar();
		}catch(Exception $e){
			throw $e;	
		}
	}
	/**
	 * Método que permite eliminar un módulo de la tabla t_modulo. 
	 *
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 * @throws  No lanza excepción.
	 */
	private static function eliminar(){
		try{
			$codigo=PostGet::obtenerPostGet('codigo');
		 	ModuloServicio::eliminar($codigo);
		 	
			Vista::asignarDato('estatus',1);
			Vista::asignarDato('codigo',$codigo);
			Vista::mostrar();
		}catch(Exception $e){
			throw $e;	
		}
	}
	/**
	 * Método que permite obtener los módulos de la tabla t_modulo a través de un patrón 
	 * enviado por POSt o GET. 
	 *
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 * @throws  No lanza excepción.
	 */
	public static function filtrar(){
			try{

			$patron=PostGet::obtenerPostGet('patron');
			$modulos=ModuloServicio::filtrar($patron);
		
					Vista::asignarDato('modulos',$modulos);
					Vista::asignarDato('estatus',1);
				
				Vista::mostrar();
			}catch(Exception $e){
				throw $e;
			}


	}




}


?>

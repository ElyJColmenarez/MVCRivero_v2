<?php
/**
 * TablaControlador.php - Componente de MVCRIVERO.
 * 
 * Este es el controlador del módulo Tabla, permite manejar las 
 * operaciones relacionadas con las tablas (agregar, modificar,
 * eliminar, consultar, buscar,etc), es el intermediario entre 
 * la base de datos y la vista.Todas las funciones de esta clase relanzan las excepciones si son capturadas.
 * Esto con el fin de que la clase manejadora de errores las capture y procese.
 *
 * @copyright 2016 - Instituto Universtiario de Tecnología Dr. Federico Rivero Palacio
 * @license GPLv3
 * @license http://www.gnu.org/licenses/gpl-3.0.html
 *
 *
 * 
 * @author GERALDINE CASTILLO (geralcs94@gmail.com)
 * @author JHONNY VIELMA 	  (jhonnyvq1@gmail.com)
 * @author Johan Alamo (lider de proyecto) <johan.alamo@gmail.com>
 * 
 * @package MVC
 *
 *
 * @link  modulos/tabla/modelo/TablaServicio.php  Clase que maneja el modelo del modulo.
 * @link  negocio/Accion.php 	                  Objeto Accion
 * @link  negocio/Tabla.php 	                  Objeto Tabla
 * @link  negocio/Tabla.php 	                  Objeto TabAccion donde se encuentra el negocio de la Acción con la permisologia en tabla.
 */

require_once"modulos/tabla/modelo/TablaServicio.php";
require_once"negocio/Tabla.php";
require_once"negocio/Accion.php";
require_once"negocio/TablaAccion.php";

class TablaControlador{
	
	
	/**
	 * Método que permite manejar las acciones relacionadas a este módulo obteniéndolas por POST o GET
	 * Y reasignando la petición al método correspondiente.
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 *
	 * @throws Exception 					En caso de acción no reconocida por el módulo.
	 */
	public static function manejarRequerimiento(){
			try {
				$usuario=Sesion::obtenerLogin();
				$accion = PostGet::obtenerPostGet('m_accion');
				if($usuario==null)
					throw new exception ("No podrá realizar ninguna operación sin antes loguearse, inicie sesión.");
				if (!$accion) 
					$accion = 'obtTabPerCatalogo';

				if ($accion == 'obtTabPerCatalogo')	{
					if($usuario->obtenerPermiso("TablaListar"))
						self::obtenerTablasPerCatalogo();
					else 
						throw new exception ("Permiso denegado a la lista de tablas, revise sus privilegios o contacte al administrador.");
				}elseif($accion=="agregar") {
					if($usuario->obtenerPermiso("TablaAgregar"))
						self::agregar();
					else 
						throw new exception ("Permiso denegado para agregar tablas, revise sus privilegios o contacte al administrador.");
				}elseif($accion=="eliminar"){
					if($usuario->obtenerPermiso("TablaEliminar"))
						self::eliminar();
					else 
						throw new exception ("Permiso denegado para eliminar tablas, revise sus privilegios o contacte al administrador.");
				}elseif($accion=="modificar") {
					if($usuario->obtenerPermiso("TablaModificar"))
						self::modificar();
					else 
						throw new exception ("Permiso denegado para modificar Tablas, revise sus privilegios o contacte al administrador.");
				}elseif($accion=="listar") {
					if(($usuario->obtenerPermiso("TablaListar"))||($usuario->obtenerPermiso('AccionAgregar')) ||($usuario->obtenerPermiso('AccionModificar')))
						self::listar();
					else 
						throw new exception ("Permiso denegado para listar tablas, revise sus privilegios o contacte al administrador.");
				}else
					throw new Exception ("acción inválida en el controlador de tabla: ".$accion);
			}catch (Exception $e){
					throw $e;
			}
	}
	/**
	 * Método que permite obtener un patrón y tipo de búsqueda para obtener la lista de tablas
	 * que se encuentran en la tablas 'table' del catalogo de postgres, filtrándolas mediante
	 * el patrón recibido por POST O GET y luego se asignan tablas a la vista y son mandadas 
	 * al cliente.
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 *
	 * @throws Exception 					Cualquier error que ocurra al obtener las tablas.
	 */
	public static function obtenerTablasPerCatalogo(){
		try {
			$patron = PostGet::obtenerPostGet('patron');
			$tipoB = PostGet::obtenerPostGet('tipoB');

			$tablas= TablaServicio::listarTablasAgregadasOno($patron,$tipoB);
			Vista::asignarDato("tablas",$tablas);
			Vista::asignarDato("estatus",1);
			Vista::mostrar();
		}catch (Exception $e){
					throw $e;
		}
	}
	/**
	 *  Método que permite obtener la lista de tablas implicadas en una acción con las permisología
	 *  así como las que no están relacionas con dicha acción y esta lista sera la que coincida con 
	 *  el patrón y el código pasado por POST O GET , luego asigna la tablaAccion a la vista y las manda al cliente.
	 *
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 *
	 * @throws Exception 					Cualquier error que ocurra al obtener las tablas.
	 */
	public static function listar(){
		try {
			$patron = PostGet::obtenerPostGet('patron');
			$codigo= PostGet::obtenerPostGet('codigo');
			if (!$codigo)
				$codigo=null;
			$tablaAcciones=TablaServicio::listar($patron,$codigo);
			Vista::asignarDato("tablas",$tablaAcciones);
			Vista::asignarDato("estatus",1);
			Vista::mostrar();
		}catch (Exception $e){
			throw $e;
		}
	}
	/**
	 *  Método que permite agregar una tabla a la base de datos recibiendo el nombre de la tabla por POST O GET
	 *  y la guarda en la base de datos, de ser exitoso retornara la tabla agregada al cliente y de no se exitoso
	 *  retornara al cliente un mensaje de error.
	 *
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 *
	 * @throws Exception 					Cualquier error que ocurra al agregar la tablas.
	*/
	public static function agregar(){
		$tabla = new Tabla();
		$tabla->asignarNombre(PostGet::obtenerPostGet('nombre'));		
		$tabla->asignarCodigo(TablaServicio::agregar($tabla));
		$tablas[0]=$tabla;
		Vista::asignarDato('mensaje','Tabla agregada');
		Vista::asignarDato('tabla',$tablas);
		Vista::asignarDato('estatus',1);
		Vista::mostrar();
	}	
	/**
	 *  Método que permite eliminar una tabla a la base de datos recibiendo el nombre y código de la tabla por POST O GET
	 *  para eliminar de la base de datos, de ser exitoso retornara un mensaje de éxito al cliente y la lista de tablas 
	 *  actualizadas, de no ser exitoso mandara un mensaje de lo ocurrido al cliente.
	 *  
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 *
	 * @throws Exception 					Cualquier error que ocurra al eliminar la tabla.
	*/
	public static function eliminar(){
		$tabla= new Tabla();
		$tabla->asignarNombre(PostGet::obtenerPostGet('nombre'));
		$tabla->asignarcodigo(PostGet::obtenerPostGet('codigo'));
		$tipo=PostGet::obtenerPostGet('tipo');
		TablaServicio::eliminar($tabla->obtenerCodigo());
		Vista::asignarDato('mensaje','Tabla '.$tabla->obtenerNombre().' eliminada');
		Vista::asignarDato('codigo',$tabla->obtenerCodigo());
		$tabla=TablaServicio::obtenerDeCatalogo($tabla->obtenerNombre());
		Vista::asignarDato('tabla',$tabla);
		Vista::asignarDato('estatus',1);
		Vista::mostrar();
	}	
	/**
	 *  Método que permite modificar una tabla a la base de datos recibiendo el nombre y código de la tabla por POST O GET
	 *  para actualizar en la base de datos, de ser exitoso retornara un mensaje de éxito al cliente y la lista de tablas 
	 *  actualizadas, de no ser exitoso mandara un mensaje de lo ocurrido al cliente.
	 *  
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 *
	 * @throws Exception 					Cualquier error que ocurra al modificar la tabla.
	*/
	public static function modificar(){
		$tabla= new Tabla();
		$tabla->asignarNombre(PostGet::obtenerPostGet('nombre'));
		$tabla->asignarcodigo(PostGet::obtenerPostGet('codigo'));
		TablaServicio::modificar($tabla);
		Vista::asignarDato('mensaje','Tabla '.$tabla->obtenerNombre().' modificada');
		$tablas= TablaServicio::listarTablasAgregadasOno("","T");
		Vista::asignarDato("tablas",$tablas);
		Vista::asignarDato('estatus',1);
		Vista::mostrar();
	}
	
	
}

?>

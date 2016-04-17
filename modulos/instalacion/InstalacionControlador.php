<?php
/**
 * InstalacionControlador.php - Componente de MVCRIVERO.
 * 
 * Este es el controlador del módulo Instalación, permite manejar las 
 * operaciones relacionadas con la instalación de la aplicación (mostrar, comprobar componentes,
 * e instalar), es el intermediario entre la base de datos y la vista. Todas las funciones de esta clase
 * relanzan las excepciones si son capturadas. Esto con el fin de que la clase manejadora de errores las capture y procese.
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
 * @link  negocio/Componentes.php  							  Clase encargada de el control de los componentes para la instalación.
 * @link  negocio/Modulo.php 	   							  Objeto Modulo.
 * @link  negocio/Usuario.php 	  							  Objeto Usuario.
 * @link  negocio/Tabla.php 	   							  Objeto Tabla.
 * @link  negocio/TablaAccion.php  							  Objeto TablaAccion.
 * @link  negocio/Accion.php       						      Objeto Accion.
 * @link  modulos/instalacion/modelo/InstalacionServicio.php  Servicio(modelo) del modulo Instalación.
 * @link  modulos/tabla/modelo/TablaServicio.php              Servicio(modelo) del modulo Tabla.
 * @link  modulos/modulo/modelo/ModuloServicio.php            Servicio(modelo) del modulo Modulo.    
 * @link  modulos/accion/modelo/AccionServicio.php            Servicio(modelo) del modulo Accion.
 * @link  modulos/usuario/modelo/UsuarioServicio.php          Servicio(modelo) del modulo Usuario.             
 */

require_once "negocio/Componentes.php";
require_once "negocio/Modulo.php";
require_once "negocio/Usuario.php";
require_once "negocio/Tabla.php";
require_once "negocio/TablaAccion.php";
require_once "negocio/Accion.php";
require_once "modulos/instalacion/modelo/InstalacionServicio.php";
require_once "modulos/tabla/modelo/TablaServicio.php";
require_once "modulos/modulo/modelo/ModuloServicio.php";
require_once "modulos/accion/modelo/AccionServicio.php";
require_once "modulos/usuario/modelo/UsuarioServicio.php";

class InstalacionControlador{
	
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

				$accion = PostGet::obtenerPostGet('m_accion');
				if (!$accion) 
					$accion = 'mostrar';

				if ($accion == 'mostrar')	self::mostrar();
				else if ($accion == 'comInstalacion')	self::comIntalacion();
				else if ($accion == 'camConCampos')	self::camConCampos();
				else if ($accion == 'instalar')	self::instalar();
				else
					throw new Exception ("acción inválida en el controlador del instalacion: ".$accion);
			}catch (Exception $e){
					throw $e;
			}
	}
	/**
	 * Método que permite manejar ir a la pantalla principal de instalación.
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 *
	 * @throws Exception 					No lanza excepciones.
	 */
	public static function mostrar(){
		Vista::mostrar();
	}	
	
	/**
	 * Método que permite comprobar los componentes para instalar.
	 *
	 * Método publico y estático que permite comprobar los componentes mínimos para la instalación,
	 * después que lo  comprueba se los asigna a la vista y manda la información a la vista.
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 *
	 * @throws Exception 					Excepciones que ocurran al comprobar los componentes.
	 */
	public static function comIntalacion(){
		$componentes= new Componentes();
		$componentes->comInstalacion();
		
		Vista::asignarDato('Componentes',$componentes);
		Vista::mostrar();
	}

	/**
	 * Método que permite cambiar la configuración del nombre de los campos(campo1,cmpo2 y campo3) del usuario
	 * en el archivo config.init .
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 *
	 * @throws Exception | ninguna
	 */
	public static function camConCampos(){


		$instalacion= new Instalacion();

		$instalacion->obtenerInstalacionIni();

		$instalacion->asignarCampo1(PostGet::obtenerPostGet("campo1"));
		$instalacion->asignarCampo2(PostGet::obtenerPostGet("campo2"));
		$instalacion->asignarCampo3(PostGet::obtenerPostGet("campo3"));
		
		$instalacion->crearArchivo();
		$instalacion->guardarDatosAplicacion();
		Vista::asignarDato('estatus',1);
		Vista::asignarDato('mensaje','Campos configurados');
		Vista::mostrar();
	}

	/**
	 * Método que permite instalar la aplicación.
	 *
	 * Método publico que permite instalar la aplicación, dividiéndola por pasos donde cada paso 
	 * se encarga de ejecutar sentencias diferentes a continuación se explicara cada paso, por cada paso 
	 * que se realiza se manda la información al usuario.
	 * PASO 1(CONEXION) : Se realiza la conexión a la base de datos con el usuario administrador con el cual se creara la base de datos y aplicación. 
	 * PASO 2(CREAR BASE DE DATOS): Se crea la base de datos y se corre el script que crea los procedimientos de almacenados referentes a la instalación.
	 * PASO 3(CREAR ADMINISTRADOR): Se crea el usuario administrador y se le asignar todos los permisos de administrador de la base de datos creada,
	 *                              así como permisos en schema y en secuencias y se corre el script de complementosUsuariosBD.
	 * PASO 4(CREAR APLICACIÓN):    Se termina de crear la aplicación, se crea la tabla del schema per, las del schema sis, se corren los script
	 *                              de los módulos (accion, usuario,tabla,usuarioAccion y tablaAccion), se insertan los institutos del modulo de prueba,
	 *                              y se insertan todas las acciones, modulos, tablas, permisos de acción en tabla y se le asignan los permisos al usuario
	 *                              administrador.
	 * @param 	Ninguno.
	 * @return  Ninguno. 
	 *
	 * @throws Exception 					Excepciones que ocurran al comprobar los componentes.
	 */
	public static function instalar(){
		// Asignacion de objeto instalacion.
		$instalacion= new Instalacion();
		$codificacion=PostGet::obtenerPostGet("codificacion");
		$instalacion->asignarUsuConectorBD(PostGet::obtenerPostGet("usuario"))->
		asignarPassConectorBD(PostGet::obtenerPostGet("contraseña"))->
		asignarServidor(PostGet::obtenerPostGet("servidor"))->
		asignarPuerto(PostGet::obtenerPostGet("puerto"))->
		asignarBD(PostGet::obtenerPostGet("basDatos"))->
		asignarNombreBD(PostGet::obtenerPostGet("nomBasDatos"))->
		asignarCodificacion($codificacion[0])->
		asignarNombreAdmin(PostGet::obtenerPostGet("nombre"))->
		asignarApellidoAdmin(PostGet::obtenerPostGet("apellido"))->
		asignarUsuarioAdmin(PostGet::obtenerPostGet("nomUsuario"))->
		asignarPassAdmin(PostGet::obtenerPostGet("conUsuario"))->
		asignarNombreAplicacion(PostGet::obtenerPostGet("nomAplicacion"))->
		asignarAbreviacionAplicacion(PostGet::obtenerPostGet("abrAplicacion"))->
		asignarPasos(PostGet::obtenerPostGet("pasInstalacion"))->
		asignarUsuBD(PostGet::obtenerPostGet("usuariosBD")) -> 
		asignarCampo1("Campo1")->asignarCampo2("Campo2")->asignarCampo3("Campo3");
		
		//////////////////////////////////////////////// PASO 1//////////////////////////////////////////////////////////////////////////////////////////////
		if ($instalacion->obtenerPaso(0)==0){
			try{
				Conexion::iniciar($instalacion->obtenerServidor(),'postgres',$instalacion->obtenerPuerto(),$instalacion->obtenerUsuConectorBD(),$instalacion->obtenerPassConectorBD());
				InstalacionServicio::priConexion(); //Realiza conexión.
				$instalacion->asignarPaso(0,1);
				Vista::asignarDato("Instalacion",$instalacion); 
				Vista::mostrar();
			}catch(Exception $e){
				Vista::asignarDato("Instalacion",$instalacion);
				throw new Exception('Parámetros de conexión incorrectos. Revise usuario, contraseña, puerto, servidor y base de datos');
			}
		//////////////////////////////////////////////// PASO 2//////////////////////////////////////////////////////////////////////////////////////////////	
		}else if (($instalacion->obtenerPaso(0)==1)&& $instalacion->obtenerPaso(1)==0){
			try{
				Conexion::iniciar($instalacion->obtenerServidor(),'postgres',$instalacion->obtenerPuerto(),$instalacion->obtenerUsuConectorBD(),$instalacion->obtenerPassConectorBD());
				InstalacionServicio::creBasDeDatos($instalacion->obtenerNombreBD(),$instalacion->obtenerCodificacion()); //se crea la base de datos
				Conexion::iniciar($instalacion->obtenerServidor(),$instalacion->obtenerNombreBD(),$instalacion->obtenerPuerto(),$instalacion->obtenerUsuConectorBD(),$instalacion->obtenerPassConectorBD());
				InstalacionServicio::ejecutarScript("otros/scripts/minInstalacionServicio.sql","@@");//ejecución del script de Instalación
				$instalacion->asignarPaso(1,1);
				Vista::asignarDato("Instalacion",$instalacion); 
				Vista::mostrar();
			}catch(Exception $e){
				Vista::asignarDato("Instalacion",$instalacion);
				if ($e->getCode()=="42P04"){
					throw new Exception("Base de datos (".$instalacion->obtenerNombreBD().") ya existe.");
				}else if ($e->getCode()=="42501"){
					$instalacion->asignarPaso(0,0);
					throw new Exception($instalacion->obtenerUsuConectorBD()." no tiene el permiso para crear la base de datos (".$instalacion->obtenerNombreBD().") ");
					
				}else{
					throw $e;
				}
			}
		//////////////////////////////////////////////// PASO 3//////////////////////////////////////////////////////////////////////////////////////////////
		}else if (($instalacion->obtenerPaso(0)==1)&& ($instalacion->obtenerPaso(1)==1) &&($instalacion->obtenerPaso(2)==0) ){
					try{
						Conexion::iniciar($instalacion->obtenerServidor(),$instalacion->obtenerNombreBD(),$instalacion->obtenerPuerto(),$instalacion->obtenerUsuConectorBD(),$instalacion->obtenerPassConectorBD());
						InstalacionServicio::ejecutarScript("otros/scripts/minUsuarioServicio.sql","@@");
						$usuario=new Usuario();
						$usuario->asignarUsuario($instalacion->obtenerUsuarioAdmin())->asignarClave($instalacion->obtenerPassAdmin());
					
						UsuarioServicio::creUsuario($usuario,'s');// se crea usuario administrador como superuser
	
						InstalacionServicio::asiDueBasDatos($instalacion->obtenerNombreBD(),$instalacion->obtenerUsuarioAdmin());//dueño de base de dato

						InstalacionServicio::asiUsuDueSchemas($instalacion->obtenerUsuarioAdmin()); //dueño de schemas
						InstalacionServicio::asiPerSchemas(); //permisos de schema

						InstalacionServicio::asiPerSecuencias($instalacion->obtenerUsuBD());//permisos en secuencias
						InstalacionServicio::asiUsuDueSequences($instalacion->obtenerUsuarioAdmin(),$instalacion->obtenerUsuBD());// dueño de schemas

						$instalacion->asignarPaso(2,1);
						Vista::asignarDato("Instalacion",$instalacion); 
					Vista::mostrar();
					}catch(Exception $e){
						Vista::asignarDato("Instalacion",$instalacion);
						if ($e->getCode()=="42710")
							throw new Exception(" El usuario (".$instalacion->obtenerUsuarioAdmin().") ya existe");
						else if ($e->getCode()=="42501"){
							$instalacion->asignarPaso(0,0);
							throw new Exception($instalacion->obtenerUsuConectorBD()." no tiene el permiso para crear usuarios ");
						}else 
							throw $e;
					}
			}
		///////////////////////////////////////////////////// PASO 4//////////////////////////////////////////////////////////////////////////////////////////////
		else if (($instalacion->obtenerPaso(0)==1)&& ($instalacion->obtenerPaso(1)==1) &&($instalacion->obtenerPaso(2)==1)){
					Conexion::iniciar($instalacion->obtenerServidor(),$instalacion->obtenerNombreBD(),$instalacion->obtenerPuerto(),$instalacion->obtenerUsuarioAdmin(),$instalacion->obtenerPassAdmin());

					InstalacionServicio::creTabSchPermiso($instalacion);//se crea tabla del schema per
					InstalacionServicio::creTabSchSistema(); // se crea tabla del schema sis
					InstalacionServicio::creTabSchError();//se crean las tablas de error.

					$usuario= new Usuario(); //asignar administrador a objeto
					$usuario->asignarUsuario($instalacion->obtenerUsuarioAdmin())->asignarClave($instalacion->obtenerPassAdmin())->asignarTipo('U');
					
					

					InstalacionServicio::ejecutarScript("otros/scripts/minAccionProcedimientos.sql","@@"); //script de acción
					InstalacionServicio::ejecutarScript("otros/scripts/minModuloServicio.sql","@@");// script de módulo
					
					InstalacionServicio::ejecutarScript("otros/scripts/minUsuarioAccionProcedimientos.sql","@@"); // script de usuario acción 
					if ($instalacion->obtenerUsuBD()!="false"){
						$usuario->asignarCodigo(UsuarioServicio::agregarUsuBsaDatos($usuario));// agregar usuario a tabla usuario
						InstalacionServicio::ejecutarScript("otros/scripts/minTablaProcedimientos.sql","@@");// script de tabla
						InstalacionServicio::ejecutarScript("otros/scripts/minTabAccionServicio.sql","@@");//script de tabAccion 
						InstalacionServicio::ejecutarScript("otros/scripts/minComponentesUsuariosBD.sql","@@");//script de tabAccion 
					}else 
						$usuario->asignarCodigo(UsuarioServicio::agregarNoUsuBsaDatos($usuario));

					InstalacionServicio::insInstitutos();// se insertan los institutos del módulo prueba
					
					//se crean los módulos
					$modulo= new Modulo(null,"Login","Módulo que engloba las acciones relacionadas con Login");
					$codModLogin=ModuloServicio::agregar($modulo);

					$modulo= new Modulo(null,"Accion","Módulo que engloba las acciones relacionadas con Acción");
					$codModAccion=ModuloServicio::agregar($modulo);

					$modulo= new Modulo(null,"Usuario","Módulo que engloba las acciones relacionadas con Usuarios");
					$codModUsuario=ModuloServicio::agregar($modulo);

					$modulo= new Modulo(null,"Modulo","Módulo que engloba las acciones relacionadas con Módulo");
					$codModModulo=ModuloServicio::agregar($modulo);

					$modulo= new Modulo(null,"Instituto","Módulo que engloba las acciones relacionadas con Instituto");
					$codModInstituto=ModuloServicio::agregar($modulo);
					// se crean las tablas
					if ($instalacion->obtenerUsuBD()!="false"){

						$modulo= new Modulo(null,"Tabla","Módulo que engloba las acciones relacionadas con Tabla");
						$codModTabla=ModuloServicio::agregar($modulo);

						$tabla=  new Tabla();$tabla->asignarNombre("per.t_tabla");
						$codTabTabla=TablaServicio::agregar($tabla);
						$tabla=  new Tabla();$tabla->asignarNombre("per.t_usuario");
						$codTabUsuario=TablaServicio::agregar($tabla);
						$tabla=  new Tabla();$tabla->asignarNombre("per.t_modulo");
						$codTabModulo=TablaServicio::agregar($tabla);
						$tabla=  new Tabla();$tabla->asignarNombre("per.t_accion");
						$codTabAccion=TablaServicio::agregar($tabla);
						$tabla=  new Tabla();$tabla->asignarNombre("per.t_tab_accion");
						$codTabAccTabla=TablaServicio::agregar($tabla);
						$tabla=  new Tabla();$tabla->asignarNombre("per.t_acc_usuario");
						$codTabAccUsuario=TablaServicio::agregar($tabla);
						$tabla=  new Tabla();$tabla->asignarNombre("sis.t_instituto");
						$codTabInstituto=TablaServicio::agregar($tabla);

					}
					//se crea la acción y se asigna a usuario 
					$accion = new Accion(null,"IniciarSesion","Acción que permite al usuario iniciar sesión",$codModLogin);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabUsuario,"S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabAccion,"S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabAccUsuario,"S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					$accion = new Accion(null,"InstitutoListar","Acción que permite obtener la lista de institutos",$codModInstituto);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabInstituto,"S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					$accion = new Accion(null,"InstitutoModificar","Acción que permite modificar institutos",$codModInstituto);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabInstituto,"U",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					$accion = new Accion(null,"InstitutoEliminar","Acción que permite eliminar institutos",$codModInstituto);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabInstituto,"D",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					$accion = new Accion(null,"InstitutoAgregar","Acción que permite agregar institutos",$codModInstituto);
					$codAccion=AccionServicio::agregar($accion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabInstituto,"I",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}






					$accion = new Accion(null,"AccionListar","Acción que permite obtener la lista de acciones",$codModAccion);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabAccion,"S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					$accion = new Accion(null,"AccionAgregar","Acción que permite agregar una acción a la base de datos",$codModAccion);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabAccion,"I",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabModulo,"S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabTabla, "S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabAccTabla, "SIDU",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}


					$accion = new Accion(null,"AccionModificar","Acción que permite modificar una acción a la base de datos",$codModAccion);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabAccion,"U",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabModulo,"S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabTabla, "S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabAccTabla, "SIDU",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);

					}

					$accion = new Accion(null,"AccionEliminar","Acción que permite eliminar una acción a la base de datos",$codModAccion);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabAccion,"D",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					if ($instalacion->obtenerUsuBD()!="false"){
						$accion = new Accion(null,"TablaListar","Acción que permite al usuario obtener la lista de tablas",$codModTabla);
						$codAccion=AccionServicio::agregar($accion);
						UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabTabla,"S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
						$accion = new Accion(null,"TablaAgregar","Acción que permite al usuario agregar tablas",$codModTabla);
						$codAccion=AccionServicio::agregar($accion);
						UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabTabla,"I",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
						$accion = new Accion(null,"TablaModificar","Acción que permite al usuario modificar tablas",$codModTabla);
						$codAccion=AccionServicio::agregar($accion);
						UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabTabla,"U",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
						$accion = new Accion(null,"TablaEliminar","Acción que permite al usuario eliminar tablas",$codModTabla);
						$codAccion=AccionServicio::agregar($accion);
						UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabTabla,"D",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);


					}

					$accion = new Accion(null,"ModuloListar","Acción que permite obtener la lista de módulos",$codModModulo);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabModulo,"S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					$accion = new Accion(null,"ModuloAgregar","Acción que permite al usuario agregar módulos. ",$codModModulo);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabModulo,"I",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					$accion = new Accion(null,"ModuloModificar","Acción que permite al usuario modificar módulos. ",$codModModulo);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabModulo,"U",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					$accion = new Accion(null,"ModuloEliminar","Acción que permite al usuario eliminar módulos. ",$codModModulo);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabModulo,"D",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					$accion = new Accion(null,"UsuarioListar","Acción que permite al usuario listar los usuarios. ",$codModUsuario);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabUsuario,"S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					$accion = new Accion(null,"UsuarioModificar","Acción que permite al usuario modificar usuario. ",$codModUsuario);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabUsuario,"U",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					$accion = new Accion(null,"UsuarioEliminar","Acción que permite al usuario eliminar Usuarios. ",$codModUsuario);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabUsuario,"D",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					$accion = new Accion(null,"UsuarioAgregar","Acción que permite al usuario agregar Usuarios. ",$codModUsuario);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabUsuario,"I",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}

					$accion = new Accion(null,"AdministrarPrivilegios","Acción que permite al usuario aadministrar privilegios de otros usuarios. ",$codModUsuario);
					$codAccion=AccionServicio::agregar($accion);
					UsuarioServicio::agregarAccionUsuario($usuario->obtenerCodigo(),$codAccion);
					if ($instalacion->obtenerUsuBD()!="false"){
						$tabAccion = new TablaAccion($codAccion,$codTabUsuario,"S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabAccUsuario,"SIDU",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
						$tabAccion = new TablaAccion($codAccion,$codTabAccion,"S",$nombre=null);
						AccionServicio::agrTabAccion($tabAccion);
					}


					$instalacion->crearArchivo();
					$instalacion->guardarDatosAplicacion();
					$instalacion->asignarPaso(3,1);
					Vista::asignarDato("Instalacion",$instalacion); 
					Vista::mostrar();

			}
		

	}
}

?>

--	Script que permite crear los procedimientos de almacenado para la administración de 
--usuario.
--
--	Diseñadores y programadores: Jhonny Vielma      jhonnyvq1@gmail.com
--								 Geraldine Veronica geralcs94@gmail.com
--  Fecha creacion: 4/2/2016
--  
--  									Modificación 
--
--	  Fecha 		Cambios                      				  Datos Personales
--
--
--
-------------------------------Usuario-----------------------------------------------------------------------------
-----------------------------Insertar--------------------------------------------------------------------------------
----------------------------------------insertar usuario de base de datos-----------------------------------------------
--función que permite agregar un usuario en la tabla t_usuario cuando se eligió la configuración de usuarios de
--base de datos.
--Parámetros de entrada: p_usuario: cadena que representa el nombre de usuario a insertar.
--						 tipo: caracter que representa el tipo de usuario R (rol) o U(usuario)
--						 campo1: cadena en la cual se puede guardar cualquier dato referente al usurio.
--						 campo2: cadena y campo3: cadena.
--Valor de retorno: cod_usuario: entero que representa el código de ese usuario agregado.					  
CREATE OR REPLACE FUNCTION  per.f_ins_usuario(p_usuario text,tipo text default 'U', campo1 text default '',campo2 text  default '', campo3 text default '')
RETURNS integer AS
$BODY$
DECLARE 
	codigo integer := 0;

	BEGIN
		SELECT nextval('per.s_usuario') into codigo;
		insert into per.t_usuario (codigo,usuario,tipo,campo1,campo2,campo3) 
							values (codigo,p_usuario,tipo,campo1,campo2,campo3);
		RETURN codigo;		
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
------------------------------------------insertar usuario no base de datos----------------------------------------------
--función que permite insertar un usuario en la tabla t_usuario cuando se eligió la configuración
--de no usuarios de base de datos. 
--Parámetros de entrada: p_usuario: cadena que representa el nombre de usuario a insertar.
--						 p_contrasena: cadena que representa la contraseña del usuario a insertar.
--						 tipo: caracter que representa el tipo de usuario R (rol) o U(usuario)
--						 campo1: cadena en la cual se puede guardar cualquier dato referente al usurio.
--						 campo2: cadena y campo3: cadena.
--Valor de retorno: cod_usuario: entero que representa el código de ese usuario agregado.
CREATE OR REPLACE FUNCTION  per.f_ins_usu_no_bd(p_usuario text, p_contrasena text,tipo text default 'U', campo1 text default '',campo2 text  default '', campo3 text default '')
RETURNS integer AS
$BODY$
DECLARE 
	codigo integer := 0;

	BEGIN
		SELECT nextval('per.s_usuario') into codigo;
		insert into per.t_usuario (codigo,usuario,pass,tipo,campo1,campo2,campo3) 
					values (codigo,p_usuario,p_contrasena,tipo,campo1,campo2,campo3);
		RETURN codigo;
			
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

----------------------------------------Crear usuario------------------------------------------------------------
--Función que permite crear un usuario de base de datos.
--Parámetros de entrada: p_usuario:    cadena que representa el nombre del usuario
--						 p_contraseña: cadena que representa la contraseña del usuario.
--						 p_tipo:       caracter que representa que tipo de usuario se va a crear,
--									   por default 'u' y al pasarle 's' crea un superuser.
--Valor d retorno: ninguno. 
CREATE OR REPLACE FUNCTION per.f_usuario_crear(p_usuario TEXT, p_contrasena TEXT,p_tipo char default 'u')
RETURNS void AS
$BODY$
DECLARE
	CADENA TEXT;

	BEGIN
  	IF(p_tipo='u') then 
		CADENA:='CREATE USER ' || p_usuario || ' PASSWORD '''|| p_contrasena ||'''';
	ELSE
		CADENA:='CREATE USER ' || p_usuario || ' PASSWORD '''|| p_contrasena ||'''SUPERUSER';
	END IF;
		
	execute	CADENA;	
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

--------------------------------------Obtener----------------------------------------------------------------------
--función que permite obtener un usuario de la tabla t_usuario usuario de la base de datos creada.
--Parámetros de entrada: p_codigo: entero que representa el código del usuario a obtener.
--						 p_cursor: nombre que representa el cursor que será retornado(Parámetro por referencia).
--Valor de retorno: p_cursor: cursor de la fila del usuario a obtener.
CREATE OR REPLACE FUNCTION per.f_usuario_obtener( p_codigo integer,p_cursor refcursor)
	RETURNS refcursor AS
	$BODY$
	BEGIN
		OPEN p_cursor FOR
			select * from per.t_usuario where codigo=p_codigo;
		RETURN p_cursor;
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
--------------------------------------Modificar-------------------------------------------------------------------
--función que permite modificar un usuario de la tabla t_usuario cuando son usuarios de base de datos.
--Parámetros de entrada: p_codigo: entero que representa el código del usuario a modificar.
--						 p_tipo: caracter que representa el tipo de usuario R(rol) o U(usuario).
--						 campo1: cadena en la cual se puede guardar cualquier dato referente al usurio.
--						 campo2: cadena y campo3: cadena.
--Valor de retorno: entero que representará el resultado de la operación. 1 si fue exitoso, 0 sino.
CREATE OR REPLACE FUNCTION per.f_usuario_modificar(p_codigo integer,p_tipo char, p_campo1 text, p_campo2 text, p_campo3 text)
  RETURNS integer AS
$BODY$
	BEGIN
		UPDATE per.t_usuario SET tipo = p_tipo, campo1 = p_campo1, campo2 = p_campo2, campo3 = p_campo3
						 WHERE codigo=p_codigo;
			IF found THEN
				RETURN 1; --ÉXITO 
			ELSE
				RETURN 0; -- NO SE MODIFICÓ, NO HAY FILAS AFECTADAS
			END IF;
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
--------------------------------------Eliminar------------------------------------------------------------------------
--función que permite eliminar un usuario de la tabla t_usuario de la base de datos creada.
--Parámetros de entrada: p_codigo: entero que representa el código del usuario a eliminar.
--Valor de retorno: entero que representará el resultado de la operación. 1 si fue exitoso, 0 sino.
  CREATE OR REPLACE FUNCTION per.f_usuario_eliminar(p_codigo integer)
	RETURNS integer AS
	$BODY$
	BEGIN
		DELETE FROM per.t_usuario WHERE codigo = p_codigo;
		IF found THEN
			RETURN 1; --EXITOSO
		ELSE
			RETURN 0; -- NO ELIMINÓ, NO HAY FILAS AFECTADAS 
		END IF;
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
--------------------------------------Filtrar------------------------------------------------------------------------
--función que permite buscar según un patrón en la tabla t_usuario de la base de datos creada.
--Parámetros de entrada: p_patron: cadena que representa el patrón de búsqueda.
--						 p_cursor: nombre que representa el cursor que será retornado(Parámetro por referencia).
--						 p_order: cadena que representa el campo por el cual se va a ordenar la consulta.
--Valor de retorno: p_cursor: cursor de la fila o filas resultantes de la búsqueda.
CREATE OR REPLACE FUNCTION per.f_usuario_filtar(p_cursor refcursor, p_patron text, p_order text default 'usuario')
	RETURNS refcursor AS
	$BODY$
	DECLARE
	consulta text;
	BEGIN
		p_patron:='%'||p_patron||'%';
		consulta:='select * from per.t_usuario where cast(codigo as varchar) 
 					like '''||p_patron||''' or upper(usuario) like upper('''||p_patron||''')
 					 or upper(tipo) like upper('''||p_patron||''')
 					 or upper(campo1) like upper('''||p_patron||''')
 					 or upper(campo2) like upper('''||p_patron||''')
 					 or upper(campo3) like upper('''||p_patron||''')
 					 order by '||p_order||' asc';
 					 
		OPEN p_cursor FOR execute consulta;
		

		RETURN p_cursor; 
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
--------------------------------------Modificar--------------------------------------------------------------------
--función que permite modificar un usuario de la tabla t_usuario cuando no son usuarios de base de datos.
--Parámetros de entrada: p_codigo: entero que representa el código del usuario a modificar.
--						 p_clave: cadena que representa la ontraseña del usuario
--						 p_tipo: caracter que representa el tipo de usuario R(rol) o U(usuario).
--						 campo1: cadena en la cual se puede guardar cualquier dato referente al usurio.
--						 campo2: cadena y campo3: cadena.
--Valor de retorno: entero que representará el resultado de la operación. 1 si fue exitoso, 0 sino.
CREATE OR REPLACE FUNCTION per.f_usuario_mod_no_bd(p_codigo integer,p_tipo char, p_campo1 text, p_campo2 text, p_campo3 text)
  RETURNS integer AS
$BODY$
	BEGIN
		UPDATE per.t_usuario SET tipo = p_tipo, campo1 = p_campo1, campo2 = p_campo2, campo3 = p_campo3,
							
					 WHERE codigo=p_codigo;
			IF found THEN
				RETURN 1; --ÉXITO 
			ELSE
				RETURN 0; -- NO SE MODIFICÓ, NO HAY FILAS AFECTADAS
			END IF;
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
--------------------------------------Modificar contraseña--------------------------------------------------------------------
--función que permite modificar la contraseña de un usuario cuando son de base de datos.
--Parámetros de entrada: p_usuario: cadena que representa el usuario al cual se le cambiará la contraseña.
--						 clave: cadena que representa la clave del usuario.
--Valor de retorno: ninguno.
CREATE OR REPLACE FUNCTION per.f_usuario_cam_clave(p_usuario text , clave text )
  RETURNS void AS
$BODY$
DECLARE
	consulta text;
	BEGIN

		 consulta:='alter user '|| p_usuario || ' with password '''||clave ||''''; 
		 execute consulta;
	
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
--------------------------------------Modificar contraseña--------------------------------------------------------------------
--función que permite modificar la contraseña de un usuario cuando no son de base de datos.
--Parámetros de entrada: p_usuario: cadena que representa el usuario al cual se le cambiará la contraseña.
--						 clave: cadena que representa la clave del usuario.
--Valor de retorno: ninguno.
CREATE OR REPLACE FUNCTION per.f_usuario_cam_clave_no_usbd(p_codigo int, clave text )
  RETURNS void AS
$BODY$
DECLARE
	consulta text;
	BEGIN

		UPDATE per.t_usuario SET pass = clave							
				WHERE codigo=p_codigo;
	
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
--------------------------------------Eliminar usaurio--------------------------------------------------------------------
--función que permite eliminar un usuario cuando son de base de datos.
--Parámetros de entrada: p_usuario: cadena que representa el usuario.
--Valor de retorno: ninguno.
CREATE OR REPLACE FUNCTION per.f_usuario_eli_bas_datos(p_usuario text )
RETURNS void AS
$BODY$
DECLARE
	cadena text;
	
	BEGIN

	cadena:='drop user '|| p_usuario;
	execute cadena;
	
	
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;



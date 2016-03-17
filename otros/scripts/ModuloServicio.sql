--	Script que permite crear los procedimientos de almacenado para la administración de 
--módulo.
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
-----------------------------------------Módulo--------------------------------------------------------------------------
-----------------------------------Agregar-----------------------------------------------------------------------------
--función que permite agregar un módulo a la tabla t_modulo de la base de datos creada.
--Prámetros de entrada: p_nombre: cadena que representa el nombre del módulo.
--						p_descripción: cadena que representa la descripción del módulo.
--Valor de retorno: cod_modulo: entero que representa el código de ese módulo agregado.
CREATE OR REPLACE FUNCTION per.f_modulo_agregar(p_nombre TEXT, p_descripcion TEXT)
	RETURNS INTEGER AS 
	$BODY$
	DECLARE
		cod_modulo integer := 0;
	BEGIN

		SELECT nextval('per.s_modulo') into cod_modulo; -- OBTIENES EL SIGUIENTE CÓDIGO DE LA SECUENCIA QUE SE CREO, FUNCIONA COMO SERIAL
		
		insert into per.t_modulo (codigo,nombre,descripcion) values (cod_modulo,p_nombre,p_descripcion);
		RETURN cod_modulo;

	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
---------------------------------------Obtener-----------------------------------------------------------------------
--función que permite obtener un módulo de la tabla t_modulo de la base de datos creada.
--Parámetros de entrada: p_codigo: entero que representa el código del módulo a obtener.
--						 p_cursor: nombre que representa el cursor que será retornado(Parámetro por referencia).
--Valor de retorno: p_cursor: cursor de la fila del módulo a obtener.
CREATE OR REPLACE FUNCTION per.f_modulo_obtener( p_codigo integer,p_cursor refcursor)
	RETURNS refcursor AS
	$BODY$
	BEGIN
		OPEN p_cursor FOR
			select * from per.t_modulo where codigo=p_codigo;
		RETURN p_cursor;
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
----------------------------------------Modificar-------------------------------------------------------------------
--función que permite modificar un módulo de la tabla t_modulo de la base de datos creada.
--Parámetros de entrada: p_codigo: entero que representa el código del módulo a modificar.
--						 p_nombre: cadena que representa el nombre del módulo.
--						 p_descripción: cadena que representa la descripción del módulo.
--Valor de retorno: entero que representará el resultado de la operación. 1 si fue exitoso, 0 sino.
CREATE OR REPLACE FUNCTION per.f_modulo_modificar(p_codigo int,p_nombre text, p_descripcion text)
  RETURNS integer AS
$BODY$
	BEGIN
		UPDATE per.t_modulo SET nombre=p_nombre, descripcion= p_descripcion WHERE codigo= p_codigo;
			IF found THEN
				RETURN 1; 
			ELSE
				RETURN 0; 
			END IF;
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
--------------------------------------------------Eliminar--------------------------------------------------------
--función que permite eliminar un módulo de la tabla t_modulo de la base de datos creada.
--Parámetros de entrada: p_codigo: entero que representa el código del módulo a eliminar.
--Valor de retorno: entero que representará el resultado de la operación. 1 si fue exitoso, 0 sino.
CREATE OR REPLACE FUNCTION per.f_modulo_eliminar(p_codigo integer)
	RETURNS integer AS
	$BODY$
	BEGIN
		DELETE FROM per.t_modulo WHERE codigo = p_codigo;
		IF found THEN
			RETURN 1; --EXITOSO
		ELSE
			RETURN 0; -- NO ELIMINÓ, NO HAY FILAS AFECTADAS 
		END IF;
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
-----------------------------------------Filtrar----------------------------------------------------------------
--función que permite buscar según un patrón en la tabla t_modulo de la base de datos creada.
--Parámetros de entrada: p_patron: cadena que representa el patrón de búsqueda.
--						 p_cursor: nombre que representa el cursor que será retornado(Parámetro por referencia).
--Valor de retorno: p_cursor: cursor de la fila o filas resultantes de la búsqueda.
CREATE OR REPLACE FUNCTION per.f_modulo_filtar(p_cursor refcursor, p_patron text )
	RETURNS refcursor AS
	$BODY$
	BEGIN
		p_patron:='%'||p_patron||'%';
		OPEN p_cursor FOR
			select * from per.t_modulo where cast(codigo as varchar) 
 					like p_patron or upper(nombre) like upper(p_patron) order by nombre desc;
		

		RETURN p_cursor; -- CURSOS QUE SE CREA DONDE QUEDA ALMACENADA LA DATA QUE SE SELECCIONO
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;

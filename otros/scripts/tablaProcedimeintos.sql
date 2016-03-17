---------------------------------------TABLA---------------------------------------------------------------
--	Script que permite crear los procedimientos de almaacenados para la administración de tablas en base de datos.
--
--	Diseñadores y programadores: Jhonny Vielma      jhonnyvq1@gmail.com
--								 Geraldine Veronica geralcs94@gmail.com
--  Fecha creacion: 15/11/2015
--  
--  									Modificación 
--
--	  Fecha 		Cambios                      				  Datos Personales
--
--
--
--

----------------------------------------AGREGAR TABLA------------------------------------------------------------
-- DESCRIPCION:Función que permite agregar una tabla.
-- PARAMETROS DE ENTRADA:  p_nombre: String que representa el nombre de la tabla a agregar.
-- VALORES DE RETORNO:     Integer que representa el codigo donde se encuentra el registro de la tabla y retorna 0 de no insertar.

CREATE OR REPLACE FUNCTION per.f_tabla_ins(p_nombre TEXT)
	RETURNS INTEGER AS 
	$BODY$
	DECLARE
		cod_tabla integer := 0;
	BEGIN

		SELECT nextval('per.s_tabla') into cod_tabla;
		
		INSERT INTO per.t_tabla(codigo,nombre) VALUES (cod_tabla,p_nombre);
		RETURN cod_tabla;

	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;

----------------------------------------LISTA DE TABLAS------------------------------------------------------------
-- DESCRIPCION:Función que permite obtener la lista de tablas almacenas en la tabl per.t_tabla de la base de datos.
-- PARAMETROS DE ENTRADA:  p_curso:  String que representa el nombre del cursor donde se guardara la data para obtenerla de ahi.
-- VALORES DE RETORNO:     String    Representa el nombre del curso pasado por parametro donde se obtendra la data.

CREATE OR REPLACE FUNCTION per.f_tabla_listar_de_tabla(p_cursor refcursor)
	RETURNS refcursor AS
	$BODY$
	BEGIN
		OPEN p_cursor FOR
			SELECT codigo,nombre FROM per.t_tabla; 

			RETURN p_cursor;
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
----------------------------------------LISTA DE TABLAS POR ACCIONES------------------------------------------------------------
-- DESCRIPCION: Función permite obtener todas las tablas implicadas en un accion con las permisologia asi como las que no estan relacionas con dicha accion y
--				permite filtrar la lista por un patron.
-- PARAMETROS DE ENTRADA:  p_curso:  String que representa el nombre del cursor donde se guardara la data para obtenerla de ahi.
--						   p_patron: String que representa el patron por el cual se quiere filtrar la lista.
--						   p_codigo: Integer que representa el codigo de la accion y de no querer las tablas relacionadas a una accion 
--									 pasar este parametro en null.
-- VALORES DE RETORNO:     String    Representa el nombre del curso pasado por parametro donde se obtendra la data.
CREATE OR REPLACE FUNCTION per.f_tabla_listar(p_cursor refcursor, p_patron text,p_codigo integer)
	RETURNS refcursor AS
	$BODY$
	BEGIN
		p_patron:='%'||p_patron||'%';
		OPEN p_cursor FOR
			select tablas.* from
				(select acc_tabla.cod_accion,acc_tabla.permiso,tabla.*  from 
	 			(select tab_accion.* from  per.t_accion as accion inner join per.t_tab_accion as tab_accion
				on accion.codigo=tab_accion.cod_accion where accion.codigo=p_codigo) as acc_tabla
	 			right join per.t_tabla as tabla on tabla.codigo=  acc_tabla.cod_tabla  ) as tablas
			where  upper(tablas.permiso) like upper(p_patron)
	  			or cast(tablas.codigo as varchar) like p_patron
				or upper(tablas.nombre) like upper(p_patron)
	 		order by  codigo;

			RETURN p_cursor; 
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
----------------------------------------LISTA DE TABLAS y TABLAS DE CATALOGO------------------------------------------------------------
-- DESCRIPCION: Permite obtener las tablas que se encuentran en el catalogo de postgres y las que estan en la tabla per.t_tabla y
--				calificarlas para de esta manera saber cuales estan agregadas correctamente, cuales no existen en base de datos y 
--				las que faltan por agregar, cuando el campo nombrec posee el caracter I es que es un tabla que esta agregada pero
--              en la base de datos no existen una tabla con ese nombre y cuando en el campo nombret se encuentra la letra N es
--              por que esa tabla existe en la base de datos pero no esta agregada en la tabla per.t_tabla.
-- PARAMETROS DE ENTRADA:  p_curso:  String que representa el nombre del cursor donde se guardara la data para obtenerla de ahi.
--						   p_patron: String que representa el patron por el cual se quiere filtrar la lista.
--						   
-- VALORES DE RETORNO:     String    Representa el nombre del curso pasado por parametro donde se obtendra la data.
CREATE OR REPLACE FUNCTION per.f_tabla_listar_agregadas_o_no(p_cursor refcursor, p_patron text)
	RETURNS refcursor AS
	$BODY$
	BEGIN
		p_patron:='%'||p_patron||'%';
		OPEN p_cursor FOR
			SELECT coalesce(tabla.codigo,-1) as  codigo,
				coalesce(tabla.nombre,'N') as nombret ,
				coalesce(catalogo.nombre,'I') as nombrec 
			from (select schemaname ||'.'||tablename as nombre from pg_tables where 		schemaname='per' or 
				    schemaname='sis' or 
				    schemaname='aud' or 
				    schemaname='err'or 
				    schemaname='public'
			      ) as catalogo full JOIN per.t_tabla as tabla on tabla.nombre=catalogo.nombre 
			where upper(tabla.nombre) like upper(p_patron) or upper(catalogo.nombre) 
						 like upper(p_patron) 
	    		or cast (codigo as varchar) like p_patron;
			RETURN p_cursor; 
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
----------------------------------------OBTENER TABLA------------------------------------------------------------
-- DESCRIPCION: Permite obtener la tabla del codigo o nombre pasado por parametro.
-- PARAMETROS DE ENTRADA:  p_curso:  String que representa el nombre del cursor donde se guardara la data para obtenerla de ahi.
--						   p_nombre: String que representa el nombre de la tabla que se quiere obtener.
--						   p_codigo: Integer que representa el codigo de la tabla que se quiere obtener.
--						   
-- VALORES DE RETORNO:     String    Representa el nombre del cursor pasado por parametro donde se obtendra la data.
CREATE OR REPLACE FUNCTION per.f_tabla_obt_tablas(p_cursor refcursor, p_nombre text,p_codigo integer)
	RETURNS refcursor AS
	$BODY$
	BEGIN
		OPEN p_cursor FOR
			select codigo, nombre as nombret,nombre as nombrec  
				 from per.t_tabla where nombre=p_nombre or codigo=p_codigo;
			RETURN p_cursor;
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
----------------------------------------OBTENER TABLA DE CATALOGO------------------------------------------------------------
-- DESCRIPCION: Permite obtener las tablas que se encuentran en el catalogo de postgres.
-- PARAMETROS DE ENTRADA:  p_curso:  String que representa el nombre del cursor donde se guardara la data para obtenerla de ahi.
--						   p_nombre: String que representa el nombre de la tabla que se quiere obtener.
--						   
-- VALORES DE RETORNO:     String    Representa el nombre del cursor pasado por parametro donde se obtendra la data.
CREATE OR REPLACE FUNCTION per.f_tabla_listar_de_catalogo(p_cursor refcursor, p_nombre text)
	RETURNS refcursor AS
	$BODY$
	BEGIN
		OPEN p_cursor FOR
			select -1 as codigo ,schemaname || '.' || tablename as nombrec,	schemaname || '.' || tablename as nombret from pg_tables 
				where 	schemaname || '.' || tablename  = p_nombre;	
			
			RETURN p_cursor; 
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
----------------------------------------MODIFICAR TABLA------------------------------------------------------------
-- DESCRIPCION: Permite modificar una tabla de la tabla per.t_tabla.
-- PARAMETROS DE ENTRADA:  p_nombre:  String que representa el nombre que remplazara al viejo.
--						   p_codigo:  Integer que representa el codigo de la tabla que se quiere modificar.
--						   
-- VALORES DE RETORNO:     Integer    0 de no existir algun cambio en la tabla y 1 si es exitoso.
CREATE OR REPLACE FUNCTION per.f_tabla_modificar(p_nombre text, p_codigo integer)
  RETURNS integer AS
$BODY$
	BEGIN
		UPDATE per.t_tabla SET nombre=p_nombre WHERE codigo=p_codigo;
			IF found THEN
				RETURN 1; 
			ELSE
				RETURN 0; 
			END IF;
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
----------------------------------------ELIMINAR TABLA------------------------------------------------------------
-- DESCRIPCION: Permite eliminar una tabla de la tabla per.t_tabla.
-- PARAMETROS DE ENTRADA:  p_codigo:  Integer que representa el codigo de la tabla que se quiere eliminar.
--						   
-- VALORES DE RETORNO:     Integer    0 de no eliminar y 1 si es exitoso.
CREATE OR REPLACE FUNCTION per.f_tabla_eliminar(p_codigo integer)
	RETURNS integer AS
	$BODY$
	BEGIN
		DELETE FROM per.t_tabla WHERE codigo = p_codigo;
		IF found THEN
			RETURN 1; 
		ELSE
			RETURN 0; 
		END IF;
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;

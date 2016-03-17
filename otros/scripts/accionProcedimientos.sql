---------------------------------------ACCIÓN---------------------------------------------------------------
--	Script que permite crear los procedimientos de almaacenados para la administración de acciones en base de datos.
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

----------------------------------------AGREGAR ACCIÓN------------------------------------------------------------
-- DESCRIPCION:Función que permite agregar una acción.
-- PARAMETROS DE ENTRADA:  p_nombre:      String que representa el nombre de la acción a agregar.
--						   p_descripcion: String que representa la descripcion  de la acción a agregar.
--						   p_cod_modulo:  Integer que representa al codigo del modulo al que pertenece la accion.
-- VALORES DE RETORNO:     Integer que representa el codigo donde se encuentra el registro de la acción y retorna 0 de no insertar.
CREATE OR REPLACE FUNCTION per.f_accion_ins(p_nombre TEXT, p_descripcion TEXT,p_cod_modulo integer ) RETURNS INTEGER AS 
	$BODY$
	DECLARE
		cod_accion integer;
	BEGIN

		SELECT nextval('per.s_accion') into cod_accion; 
		
		insert into per.t_accion  (codigo,nombre,descripcion,cod_modulo) values (cod_accion,p_nombre,p_descripcion,p_cod_modulo);
		RETURN cod_accion;

	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
----------------------------------------MODIFICAR ACCIÓN------------------------------------------------------------
-- DESCRIPCION:Función que permite modificar una acción.
-- PARAMETROS DE ENTRADA:  p_nombre:      String que representa el nuevo nombre de la acción a modificar.
--						   p_descripcion: String que representa la nueva descripción de la acción a modificar.
--						   p_cod_modulo:  Integer que representa al nuevo codigo del modula al que pertenece la accion.
-- VALORES DE RETORNO:     Integer 1 de ser exitoso y 0 de no ser exitoso.
CREATE OR REPLACE FUNCTION per.f_accion_modificar(p_nombre text, p_descripcion Text, p_cod_modulo integer, p_codigo integer)
  RETURNS integer AS
$BODY$
	BEGIN
		UPDATE per.t_accion SET nombre=p_nombre,descripcion=p_descripcion,cod_modulo=p_cod_modulo WHERE codigo=p_codigo;
			IF found THEN
				RETURN 1;
			ELSE
				RETURN 0; 
			END IF;
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
----------------------------------------OBTENER ACCIÓN------------------------------------------------------------
-- DESCRIPCION:Función que permite obtener una acción.
-- PARAMETROS DE ENTRADA:  p_cursor:    String que representa nombre del curso donde se desea guardar la data para luego obtenerla con ese nombre.
--						   p_codigo:    Integer que representa el codigo de la acción que se quiere obtener.
-- VALORES DE RETORNO:     String       Nombre del cursor donde se encuentra la data.
CREATE OR REPLACE FUNCTION per.f_accion_obtener(p_cursor refcursor, p_codigo integer)
RETURNS refcursor AS
$BODY$
	BEGIN
		OPEN p_cursor FOR
				select * from per.t_accion where codigo=p_codigo;
		RETURN p_cursor;
	END;
$BODY$
  LANGUAGE plpgsql STABLE
  COST 100;
----------------------------------------LISTAR ACCIÓN------------------------------------------------------------
-- DESCRIPCION:Función que permite obtener la lista de acciones y filtrarla mediante un patron.
-- PARAMETROS DE ENTRADA:  p_cursor:    String que representa nombre del curso donde se desea guardar la data para luego obtenerla con ese nombre.
--						   p_patron:    String que representa el patron con el cual se quiere filtrar en la lista.
-- VALORES DE RETORNO:     String       Nombre del cursor donde se encuentra la data.
CREATE OR REPLACE FUNCTION per.f_accion_listar(p_cursor refcursor, p_patron text)
RETURNS refcursor AS
$BODY$
	BEGIN
		p_patron:='%'||p_patron||'%';
		OPEN p_cursor FOR
				SELECT * from per.t_accion where upper(nombre) like upper(p_patron) 
				or cast(codigo as varchar) LIKE p_patron order by codigo;
		return p_cursor;
	END;
$BODY$
  LANGUAGE plpgsql STABLE
  COST 100;
----------------------------------------ELIMINAR ACCIÓN------------------------------------------------------------
-- DESCRIPCION:Función que permite eliminar una acción.
-- PARAMETROS DE ENTRADA:  p_codigo:    Integer que representa codigo de la acción que se desea eliminar.
-- VALORES DE RETORNO:     Integer      1 de ser exitoso y 0 de no.
CREATE OR REPLACE FUNCTION per.f_accion_eliminar(p_codigo integer)
  RETURNS integer AS
$BODY$
	BEGIN
		delete from per.t_accion where codigo=p_codigo;
		IF found THEN
			RETURN 1; 
		ELSE
			RETURN 0; 
		END IF;
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

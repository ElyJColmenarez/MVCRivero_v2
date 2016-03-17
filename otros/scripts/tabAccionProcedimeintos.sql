---------------------------------------TABLA ACCIÓN---------------------------------------------------------------
--	Script que permite crear los procedimientos de almaacenados para la administración de los permisos de las acciones en la tabla.
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
--


----------------------------------------ELIMINAR PERMISOS DE ACCIÓN EN TABLA ------------------------------------------------------------
-- DESCRIPCION:Función que permite eliminar los permisos de una accion en tabla.
-- PARAMETROS DE ENTRADA: p_cod_accion:  Integer que representa el codigo de la accion que se elimina referente a la tabla.
--						  p_cod_tabla:   Integer que representa el codigo de la tabla donde la acción posee permisos.
-- VALORES DE RETORNO:    Integer        1 de ser exitoso la eliminación y 0 de no.
CREATE OR REPLACE FUNCTION per.f_accion_tabla_eliminar(p_cod_accion integer, p_cod_tabla integer)
  RETURNS integer AS
$BODY$
	BEGIN
		delete from per.t_tab_accion where cod_tabla=p_cod_tabla and cod_accion=p_cod_accion;
		IF found THEN
			RETURN 1; 
		ELSE
			RETURN 0; 
		END IF;
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
----------------------------------------ASIGNAR PERMISOS DE ACCIÓN EN TABLA ------------------------------------------------------------
-- DESCRIPCION:Función que permite asignar los permisos que tiene una acción en una tabla.
-- PARAMETROS DE ENTRADA: p_cod_tabla:   Integer que representa el codigo de la tabla en la cual la acció posee permisos.
--						  p_cod_accion:  Integer que representa el codigo de la acción a la cual se le asignara los permisos en la tabla.
--						  p_permisos:    String que representan los permisos que posee la acción en la tabla ejemplo: IUSD, cada uno representa
--										 la inicial del permiso que posee la acción en la tabla I= insert, S= select, D= delete y U= update,
-- VALORES DE RETORNO:    Integer        que representa el codigo del registro insertado y 0 de no haber insertado.
 CREATE OR REPLACE FUNCTION per.f_tab_accion_ins(p_cod_tabla integer,p_cod_accion integer, p_permisos Text)
	RETURNS INTEGER AS 
	$BODY$
	DECLARE
		cod_tab_accion integer;
	BEGIN

		SELECT nextval('per.s_tab_accion') into cod_tab_accion; 
		
		insert into per.t_tab_accion (codigo,cod_tabla,cod_accion,permiso)
					     values(cod_tab_accion,p_cod_tabla,p_cod_accion,upper(p_permisos));
		RETURN cod_tab_accion;

	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
----------------------------------------MODIFICAR PERMISOS DE ACCIÓN EN TABLA ------------------------------------------------------------
-- DESCRIPCION:Función que permite modificar los permisos que tiene una acción en una tabla.
-- PARAMETROS DE ENTRADA: p_cod_tabla:   Integer que representa el codigo de la tabla en la cual la accion posee los permisos y se modificara.
--						  p_cod_accion:  Integer que representa el codigo de la acción a la cual se le modificaran los permisos en la tabla.
--						  p_permisos:    String que representan los permisos que se modificaran de la acción en la tabla ejemplo: IUSD, cada uno representa
--										 la inicial del permiso que posee la acción en la tabla I= insert, S= select, D= delete y U= update,
-- VALORES DE RETORNO:    Integer        1 de modificado con exito y 0 de fallido.
CREATE OR REPLACE FUNCTION per.f_tab_accion_modificar(p_cod_tabla integer, p_cod_accion integer, p_permisos text)
  RETURNS integer AS
$BODY$
	BEGIN
		UPDATE per.t_tab_accion SET permiso=upper(p_permisos) WHERE cod_accion=p_cod_accion and cod_tabla=p_cod_tabla;
			IF found THEN
				RETURN 1; 
			ELSE
				RETURN 0; 
			END IF;
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

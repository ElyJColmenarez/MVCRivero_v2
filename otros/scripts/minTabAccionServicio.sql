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
@@
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
@@
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

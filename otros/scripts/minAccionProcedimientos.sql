
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
@@
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
@@
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
@@
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
@@
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

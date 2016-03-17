
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
@@
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
@@
CREATE OR REPLACE FUNCTION per.f_modulo_modificar(p_codigo int,p_nombre text, p_descripcion text)
  RETURNS integer AS
$BODY$
	BEGIN
		UPDATE per.t_modulo SET nombre=p_nombre, descripcion= p_descripcion WHERE codigo= p_codigo;
			IF found THEN
				RETURN 1; --ÉXITO 
			ELSE
				RETURN 0; -- NO SE MODIFICÓ, NO HAY FILAS AFECTADAS
			END IF;
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
@@
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
@@
CREATE OR REPLACE FUNCTION per.f_modulo_filtar(p_cursor refcursor, p_patron text )
	RETURNS refcursor AS
	$BODY$
	BEGIN
		p_patron:='%'||p_patron||'%';
		OPEN p_cursor FOR
			select * from per.t_modulo where cast(codigo as varchar) 
 					like p_patron or upper(nombre) like upper(p_patron) order by nombre asc;
		

		RETURN p_cursor; -- CURSOS QUE SE CREA DONDE QUEDA ALMACENADA LA DATA QUE SE SELECCIONO
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;

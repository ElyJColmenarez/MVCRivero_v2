CREATE OR REPLACE FUNCTION per.f_usuario_usu_acc_insertar(p_cod_usuario Integer, p_cod_accion Integer )
	RETURNS INTEGER AS 
	$BODY$
	DECLARE
		cod_usu_accion integer := 0;
	BEGIN

		SELECT nextval('per.s_acc_usuario') into cod_usu_accion; 
		
		INSERT INTO per.t_acc_usuario(codigo,cod_usuario,cod_accion) VALUES (cod_usu_accion,p_cod_usuario,p_cod_accion);
		RETURN cod_usu_accion;

	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
@@
CREATE OR REPLACE FUNCTION per.f_usuario_acc_usu_eliminar(p_cod_usuario integer,p_cod_accion integer)
	RETURNS integer AS
	$BODY$
	BEGIN
		DELETE FROM per.t_acc_usuario WHERE cod_usuario = p_cod_usuario and cod_accion=p_cod_accion;
		IF found THEN
			RETURN 1; --EXITOSO
		ELSE
			RETURN 0; -- NO ELIMINO, NO HAY FILAS AFECTADAS 
		END IF;
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
@@
CREATE OR REPLACE FUNCTION per.f_usuario_obt_usu_acciones(p_cursor refcursor,p_usuario text ,p_patron text)
	RETURNS refcursor AS
	$BODY$
	BEGIN
		p_patron:='%'||p_patron||'%';
		OPEN p_cursor FOR
			select usuarios.codigo, usuarios.usuario,usu_acciones.codigo as cod_usu_accion,acciones.nombre,acciones.codigo as cod_accion 
				from (select codigo, usuario from per.t_usuario where usuario= p_usuario )as usuarios
					inner join per.t_acc_usuario as usu_acciones on usu_acciones.cod_usuario= usuarios.codigo
					right join per.t_accion as acciones on acciones.codigo = cod_accion
				where upper(acciones.nombre) like upper(p_patron) or cast (acciones.codigo as varchar) like (p_patron)
				order by usuarios.codigo;
			RETURN p_cursor; -- CURSOS QUE SE CREA DONDE QUEDA ALMACENADA LA DATA QUE SE SELECCIONO
	END;
	$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;

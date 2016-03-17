---------------------------------------USUARIO ACCIÓN---------------------------------------------------------------
--	Script que permite crear los procedimientos de almaacenados para la administración de los usuarios y sus acciones.
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


----------------------------------------ASIGNAR ACCIÓN A USUARIO------------------------------------------------------------
-- DESCRIPCION:Función que permite asignarle una acción a un usuario.
-- PARAMETROS DE ENTRADA: p_cod_usuario: Integer que representa el codigo del usuario.
--						  p_cod_accion:  Integer que representa el codigo de la accion a asignar.
-- VALORES DE RETORNO:    Integer que representa el codigo donde se encuentra el registro almacenado.

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

----------------------------------------ELIMINAR ACCION A USUARIO------------------------------------------------------------
-- DESCRIPCIÓN: Función que permite eliminarle una acción a un usuario o revocarsela.
-- PARÁMETRO DE ENTRADA: p_cod_accion:  Integer que representa el codigo de la accionque se va a eliminar del usuario.
--						 p_cod_usuario: Integer que represneta el codigo del usuario que se revocara la acción.
-- VALOR DE RETORNO:               Integer con el valor de 1 de ser exitoso y 0 no se ser exitoso.

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

----------------------------------------OBTENER ACCIONES ASIGNADAS A UN USUARIO Y NO ASIGNADAS------------------------------------------------------------
-- DESCRIPCIÓN: Función que permite obtener las acciones tanto asignadas y no asignadas de un usuario, si el campo patron
--              se deja en  vacio la  consulta obtendra  todas la acciones, pero si se le coloca un  patron obtendras las
--              acciones que coincidan con el patron de igual manera si el compo cod_usuario se pasa como null se obtendras
--              todas las acciones que se encuentre en base de datos.
-- PARAMETROS DE ENTRADA: p_cursor:       String con el nombre del curso donde quiere que se guarde la informacion para luego obtenerla.
--						  p_usuario:      String que representa el usuario del que se obtendran las acciones.
--						  p_patron:       String que reprenta el patron por el cual se quiere filtrar en la lista.
-- VALORES DE RETORNO:    Integer que representa el codigo donde se encuentra el registro almacenado.

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


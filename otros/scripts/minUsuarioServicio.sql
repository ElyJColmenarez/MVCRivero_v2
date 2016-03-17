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
@@
CREATE OR REPLACE FUNCTION  per.f_ins_usu_no_bd(p_usuario text, p_contrasena text ,tipo text default 'U', campo1 text default '',campo2 text  default '', campo3 text default '')
RETURNS integer AS
$BODY$
DECLARE 
	codigo integer := 0;

	BEGIN
		SELECT nextval('per.s_usuario') into codigo;
		if (tipo='U')then
		insert into per.t_usuario (codigo,usuario,pass,tipo,campo1,campo2,campo3) 
					values (codigo,p_usuario,p_contrasena,tipo,campo1,campo2,campo3);
		else 
			insert into per.t_usuario (codigo,usuario,tipo,campo1,campo2,campo3) 
					values (codigo,p_usuario,tipo,campo1,campo2,campo3);
		end if;
		RETURN codigo;
			
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
@@ 
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
@@
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
@@
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
@@
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
@@
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
@@
CREATE OR REPLACE FUNCTION per.f_usuario_mod_no_bd(p_codigo integer,p_tipo char, p_campo1 text, p_campo2 text, p_campo3 text,p_clave text)
  RETURNS integer AS
$BODY$
	BEGIN
		UPDATE per.t_usuario SET tipo = p_tipo, campo1 = p_campo1, campo2 = p_campo2, campo3 = p_campo3,
							 pass=p_clave
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
@@
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
 @@
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
@@
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

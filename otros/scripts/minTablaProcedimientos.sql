
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
@@
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
@@
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
@@
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
@@
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
@@
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
@@
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
@@
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

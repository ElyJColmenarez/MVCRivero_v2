CREATE OR REPLACE FUNCTION per.f_usuario_obtener_tablas()
RETURNS text[] AS
$BODY$
    DECLARE
	nombre text;
	tablas text[];
	contador Integer :=1;
    BEGIN
       FOR nombre in SELECT per.t_tabla.nombre from per.t_tabla 
        LOOP
           tablas[contador]:=nombre;
           contador:=contador +1;
        END LOOP;
        return tablas;
    END;
$BODY$
  LANGUAGE plpgsql STABLE
  COST 100;
@@
CREATE OR REPLACE FUNCTION per.f_usuario_rev_per_tab_usuario(p_usuario text, p_tabla text)
RETURNS void AS
$BODY$
    DECLARE
	sentencia Text :='revoke all on table '||p_tabla ||' from '||p_usuario;
    BEGIN
	execute sentencia;
    END;
$BODY$
  LANGUAGE plpgsql volatile
  COST 100; 
@@
CREATE OR REPLACE FUNCTION per.f_usuario_rev_per_usuarios(p_usuarios text[])
  RETURNS void AS
$BODY$
    DECLARE
      tablas text[];
      can_usuarios Integer;
      can_tablas Integer;
      iu Integer;it Integer;
    BEGIN
       select array_length(p_usuarios, 1) into can_usuarios; --cantidad de usuarios en el arreglo -
       select per.f_usuario_obtener_tablas() into tablas;            --arreglo de tablas.
       select array_length(tablas, 1) into can_tablas;		 --cantidad de tablas en el arreglo
	FOR iu IN 1..can_usuarios loop
		FOR it IN 1..can_tablas loop
			PERFORM per.f_usuario_rev_per_tab_usuario(p_usuarios[iu],tablas[it]);
		END loop;
        END loop;
    END;
$BODY$
  LANGUAGE plpgsql STABLE
  COST 100;
@@
CREATE OR REPLACE FUNCTION per.f_usuario_asi_per_tab_usuario(p_usuario text, p_tabla text,p_permisos text)
RETURNS void AS
$BODY$
    DECLARE
	can_per Integer;
	permiso text;
	i Integer;
	sentencia Text :='grant all privileges on table '||p_tabla||' to '|| p_usuario;
    BEGIN
	select char_length(p_permisos) into can_per;
	IF (can_per=4) THEN
		execute sentencia;
	ELSE
		sentencia:='grant ';
		FOR i IN 1..can_per loop
			select substring(upper(p_permisos) from i for 1) into permiso;
			IF (i<>1) THEN
				sentencia:=sentencia||',';
			END IF;
			
			IF (upper(permiso)='I') THEN
				sentencia:=sentencia||'insert';
			END IF;
			IF (upper(permiso)='D') THEN
				sentencia:=sentencia||'delete';
			END IF;
			IF (upper(permiso)='S') THEN
				sentencia:=sentencia||'select';
			END IF;
			IF (upper(permiso)='U') THEN
				sentencia:=sentencia||'update';
			END IF;
		END loop;
		sentencia:=sentencia||' on table '||p_tabla||' to '||p_usuario;
		execute sentencia;
	END IF;
    END;
$BODY$
  LANGUAGE plpgsql volatile
  COST 100;
@@
CREATE OR REPLACE FUNCTION per.f_usuario_asi_per_tablas_usuario(p_usuario text)
RETURNS void AS
$BODY$
    DECLARE
	registro record;
	contador Integer :=1;
	
    BEGIN
	FOR registro in select tab_acc.permiso,tabla.nombre from (select * from per.t_usuario where usuario=p_usuario ) 
				as usuario inner join per.t_acc_usuario as acc_usu on acc_usu.cod_usuario= usuario.codigo
					   inner join per.t_tab_accion as tab_acc on  tab_acc.cod_accion= acc_usu.cod_accion
					   inner join per.t_tabla as tabla on tabla.codigo=tab_acc.cod_tabla
		
        LOOP
		PERFORM per.f_usuario_asi_per_tab_usuario(p_usuario,registro.nombre,registro.permiso);
        END LOOP;
    END;
$BODY$
  LANGUAGE plpgsql volatile
  COST 100; 
@@
CREATE OR REPLACE FUNCTION per.f_usuario_asi_per_tab_acciones_usuarios(p_usuarios text[])
  RETURNS void AS
$BODY$
    DECLARE
 
      can_usuarios Integer;
      i Integer;
    BEGIN
       select array_length(p_usuarios, 1) into can_usuarios;
 
	FOR i IN 1..can_usuarios loop
		PERFORM per.f_usuario_asi_per_tablas_usuario(p_usuarios[i]);
        END loop;
    END;
$BODY$
  LANGUAGE plpgsql STABLE
  COST 100;
@@
CREATE OR REPLACE FUNCTION per.f_usuario_res_per_usu_afe_accion(p_cod_accion integer)
  RETURNS void AS
$BODY$
    DECLARE
      usuarios text[];
    BEGIN
       
       select per.f_usuario_obt_usu_por_accion(p_cod_accion) into usuarios;
       IF (array_length(usuarios, 1)>0) THEN
    PERFORM per.f_usuario_rev_per_usuarios(usuarios);
    PERFORM per.f_usuario_asi_per_tab_acciones_usuarios(usuarios);
  END IF;
  
  
    END;
$BODY$
  LANGUAGE plpgsql STABLE
  COST 100;
@@
CREATE OR REPLACE FUNCTION per.f_usuario_obt_usu_por_accion(p_cod_accion integer)
RETURNS text[] AS
$BODY$
    DECLARE
	usu text;
	usuarios text[];
	contador Integer :=1;
    BEGIN
       FOR usu in select usuario.usuario from  (select codigo from per.t_accion where codigo=p_cod_accion)as accion
		inner join per.t_acc_usuario as acc_usuario on acc_usuario.cod_accion= accion.codigo
		inner join per.t_usuario as usuario on usuario.codigo=acc_usuario.cod_usuario
        LOOP
           usuarios[contador]:=usu;
           contador:=contador +1;
        END LOOP;
        return usuarios;
    END;
$BODY$
  LANGUAGE plpgsql STABLE
  COST 100;
@@
CREATE OR REPLACE FUNCTION per.f_usuario_mod_tip_usuario(p_usuario text,p_tipo text )
RETURNS void AS
$BODY$
    DECLARE
	cadena text;
	BEGIN
	cadena:='ALTER ROLE '||p_usuario ||' WITH '|| p_tipo;
	execute cadena;
END;
$BODY$
LANGUAGE plpgsql VOLATILE
 COST 100;

 

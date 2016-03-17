----------------------------------------OBTENER TABLAS------------------------------------------------------------
-- DESCRIPCIÓN: Función que obtener la tablas que estan almacenada en la base de datos.
-- PARAMETROS DE ENTRADA: No posee.
-- VALORES DE RETORNO:    [] String donde se encuentran los nombre de las tablas.

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

----------------------------------------REVOCAR PERMISOS DE USUARIO EN TABLA------------------------------------------------------------
-- DESCRIPCIÓN: Función que permite revocarle a un usuario, los permisos en una tabla tanto de select, insert, delete y update.
-- PARAMETROS DE ENTRADA: p_usuario:   String con el nombre del usuario al que se le revocara los permisos.
--						  p_tabla:     String con el nombre de la tabla a la cual se le revocaran los eprmisos al usuario.
-- VALORES DE RETORNO:    No posee.

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

----------------------------------------REVOCAR PERMISOS DE USUARIOS EN TABLAS------------------------------------------------------------
-- DESCRIPCIÓN: Función que permite revocarle a una lista de usuarios los permisos en las tablas agregadas en la tabla per.t_tabla 
--			    tanto de select, insert, delete y update.
-- PARAMETROS DE ENTRADA: p_usuarios:  [] String con todos los usuarios que se le revocaran los permisos, llenar el arreglo a partir de la posicion 1.
-- VALORES DE RETORNO:    No posee.

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
  
----------------------------------------ASIGNAR PERMISOS DE USUARIO EN TABLA------------------------------------------------------------
-- DESCRIPCIÓN: Función que permite asignarle a un usuario permisos en una tabla tanto como de insert, delete, select y update, segun sea los pasados 
--              por parametro.
-- PARAMETROS DE ENTRADA: p_usuario:   String con el usuario que se le asignaran los permisos.
--					      p_tabla:     String con el nombre de la tabla a la cual se le asignaran permisos al usuario.
--						  p_permisos:  String con los permisos que posee el usuario en la tabla, por ejemplo: IUDS donde el usuario
--									   posee todos los permisos en la tabla cada inicial representa un permiso I= insert, D=delete,
-- 									   U= update y S= select
-- VALORES DE RETORNO:    No posee.

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
----------------------------------------ASIGNAR PERMISOS DE USUARIO EN TABLAS POR ACCIÓN------------------------------------------------------------
-- DESCRIPCIÓN: Función que permite asignarle a un usuario todos los permisos en tablas que posee en la base de datos, mediante las acciones que 
--              tenga asignada.
-- PARAMETROS DE ENTRADA: p_usuario:   String con el usuario que se le asignaran los permisos.
-- VALORES DE RETORNO:    No posee.

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

----------------------------------------ASIGNAR PERMISOS DE USUARIOS EN TABLAS POR ACCIÓN------------------------------------------------------------
-- DESCRIPCIÓN: Función que permite asignarle a una lista de usuarios los permisos en tablas que posee cada uno en la base de datos, mediante las acciones que 
--              tenga asignada cada usuario.
-- PARAMETROS DE ENTRADA: p_usuarios:   [] String la lista de usuarios que se le asignaran los permisos.
-- VALORES DE RETORNO:    No posee. 
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
----------------------------------------MODIFICAR USUARIO DE BASE DE DATOS------------------------------------------------------------
-- DESCRIPCIÓN: Función que permite modificar usuarios de base de datos.
-- PARAMETROS DE ENTRADA: p_usuario:   Usuario a modificar.
--                        p_tipo:      Tipo de privilegios que se quiere dar al usuario .
-- VALORES DE RETORNO:    No posee.
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
 ----------------------------------------RESTABLECER PERMISOS DE USUARIOS AFECCTADOR POR ACCIÒN------------------------------------------------------------
-- DESCRIPCIÓN: Función que permite restablecer los permisos de base de datos de los usuarios afectados por la accion pasada por parametro.
-- PARAMETROS DE ENTRADA: p_usuario:   codigo de la acciòn a restablecer los permisos de los usuarios que la poseen.
-- VALORES DE RETORNO:    No posee.
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
 ----------------------------------------OBTENER USUARIOS ASOCIADOS A UNA ACCIÒN------------------------------------------------------------
-- DESCRIPCIÓN: Función que permite obtener los usuarios asociados a una accion.
-- PARAMETROS DE ENTRADA: p_usuario:   codigo de la acciòn a restablecer los permisos de los usuarios que la poseen.
-- VALORES DE RETORNO:    No posee.
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

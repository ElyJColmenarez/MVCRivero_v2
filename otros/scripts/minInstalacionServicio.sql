CREATE OR REPLACE FUNCTION  f_cre_schemas()
RETURNS void AS
$BODY$
	BEGIN
		create schema sis;
		create schema per;
		create schema err;
		create schema aud;	
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
@@
select f_cre_schemas(); 
@@
CREATE OR REPLACE FUNCTION per.f_cambiar_dueño_schema(p_usuario TEXT, p_schema TEXT)
RETURNS void AS
$BODY$
DECLARE
	CADENA TEXT;

	BEGIN
  	
	CADENA:='ALTER SCHEMA ' || p_schema || ' OWNER TO '|| p_usuario ;
	execute	CADENA;	
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;  
@@
CREATE OR REPLACE FUNCTION per.f_asi_per_secuencia( p_secuencia TEXT)
RETURNS void AS
$BODY$
DECLARE
	CADENA TEXT;

	BEGIN
 

	cadena:='grant all on sequence '||  p_secuencia|| ' to public';
	execute	CADENA;	
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100; 
@@
CREATE OR REPLACE FUNCTION  per.f_asi_due_bas_datos(p_nom_bas_de_datos text, p_usuario text)
RETURNS void AS
$BODY$
	DECLARE
	CADENA TEXT;

	BEGIN
	  	
		CADENA:='ALTER DATABASE '|| p_nom_bas_de_datos || ' OWNER TO ' || p_usuario;
		execute	CADENA;	
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;  
@@
CREATE OR REPLACE FUNCTION  sis.f_cre_tab_instituto()
RETURNS void AS
$BODY$
	BEGIN
		create table sis.t_instituto(
				codigo integer not null,
				nom_corto varchar(20) not null,
				nombre varchar(100) not null,
				direccion varchar(200),
				constraint cp_instituto primary key (codigo),
				constraint ca_instituto unique(nom_corto)
				);	
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
@@
create sequence sis.s_instituto
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
@@
CREATE OR REPLACE FUNCTION  per.f_cre_tab_sch_permiso(p_tip_usuarios bool)
RETURNS void AS
$BODY$
	BEGIN
		PERFORM per.f_cre_tab_usuario(p_tip_usuarios);
		PERFORM per.f_cre_tab_modulo();	
		PERFORM per.f_cre_tab_accion();	
		PERFORM per.f_cre_tab_acc_usuario();	
		if (p_tip_usuarios=true) THEN
			PERFORM per.f_cre_tab_tabla();
			PERFORM per.f_cre_tab_tab_accion();
		END IF;
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
@@
CREATE OR REPLACE FUNCTION  per.f_cre_tab_usuario(p_tip_usuarios bool)
RETURNS void AS
$BODY$
DECLARE 
	CADENA TEXT;
	BEGIN
		cadena:= 'create table per.t_usuario(
						codigo integer not null,
						usuario varchar(30) not null, ';	
		if (p_tip_usuarios=false) THEN
			cadena:=cadena || 'pass varchar(100), ';
		END IF;

		cadena:= cadena || 'tipo char(1) not null, 
				campo1 varchar(30), 
				campo2 varchar(30), 
				campo3 varchar(30), 
				constraint cp_usuario primary key (codigo), 
				constraint uni_usuario unique (usuario), 
				constraint chk_usuario_01 check (tipo in (''U'',''R''))
				 );';	
		execute cadena;
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
@@
CREATE OR REPLACE FUNCTION  per.f_cre_tab_modulo()
RETURNS void AS
$BODY$

	BEGIN
		create table per.t_modulo(
				codigo integer not null,
				nombre varchar(30) not null,
				descripcion varchar(100),
				constraint cp_modulo primary key (codigo),
				constraint uni_modulo unique (nombre)
				 );
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
@@
CREATE OR REPLACE FUNCTION  per.f_cre_tab_accion()
RETURNS void AS
$BODY$

	BEGIN
		create table per.t_accion(
				codigo integer not null,
				nombre varchar(30) not null,
				cod_modulo integer,
				descripcion varchar(100),
				constraint cp_accion primary key (codigo),
				constraint cf_acc_modulo foreign key(cod_modulo)
				references per.t_modulo(codigo),
				constraint uni_accion unique (nombre)
				);
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
@@
CREATE OR REPLACE FUNCTION  per.f_cre_tab_acc_usuario()
RETURNS void AS
$BODY$

	BEGIN
		create table per.t_acc_usuario(
				codigo integer not null,
				cod_usuario integer not null,
				cod_accion integer not null,
				constraint cp_acc_usuario primary key (codigo),
				constraint uni_acc_usuario unique (cod_usuario,cod_accion),
				constraint cf_acc_usu_usuario foreign key(cod_usuario)
				references per.t_usuario(codigo),
				constraint cf_acc_usu_accion foreign key(cod_accion)
				references per.t_accion(codigo)
				 );
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
@@
CREATE OR REPLACE FUNCTION  per.f_cre_tab_tab_accion()
RETURNS void AS
$BODY$

	BEGIN
		create table per.t_tab_accion(
				codigo integer not null,
				cod_tabla integer not null,
				cod_accion integer not null,
				permiso varchar(4),
				constraint cp_tab_accion primary key (codigo),
				constraint uni_tab_accion unique (cod_tabla,cod_accion),
				constraint cf_tab_accion_tabla foreign key(cod_tabla)
				references per.t_tabla(codigo),
				constraint cf_tab_accion_accion foreign key(cod_accion)
				references per.t_accion(codigo)
				);
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
@@
CREATE OR REPLACE FUNCTION  per.f_cre_tab_tabla()
RETURNS void AS
$BODY$

	BEGIN
		create table per.t_tabla(
				codigo integer not null,
				nombre varchar(30) not null,
				constraint cp_tabla primary key (codigo),
				constraint uni_tabla unique (nombre)
				);
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

@@
create sequence per.s_usuario
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
@@
create sequence per.s_modulo
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
@@
create sequence per.s_accion
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
@@
create sequence per.s_acc_usuario
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
@@
  create sequence per.s_tab_accion
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
@@
create sequence per.s_tabla
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
@@
CREATE OR REPLACE FUNCTION  per.f_instituto_cargar()
RETURNS void AS
$BODY$
DECLARE
		codigo integer := 0;
	BEGIN
		select nextval('sis.s_instituto') into codigo; 
		insert into sis.t_instituto (codigo,nom_corto,nombre,direccion)
		 values (codigo,'IUTFRP', 'Instituto Universitario de Tecnología “Dr. Federico Rivero Palacio”', 'Km 8, Panamericana');

		select nextval('sis.s_instituto') into codigo; 
		insert into sis.t_instituto (codigo,nom_corto,nombre,direccion)
		 values (codigo,'CUC', 'Colegio Universitario de Caracas', 'Chacao');
		
		select nextval('sis.s_instituto') into codigo; 
		insert into sis.t_instituto (codigo,nom_corto,nombre,direccion)
		 values (codigo,'CULTCA', 'Colegio Universitario de Los Teques Cecilio Acosta', 'Km 23, Panamericana');
			
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

@@
CREATE OR REPLACE FUNCTION  per.f_asi_per_esquemas(p_esquema text)
RETURNS void AS
$BODY$
	DECLARE
	CADENA TEXT;

	BEGIN 	
		
		cadena:='grant all on schema '||  p_esquema|| ' to public';
		execute	CADENA;	
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100; 
@@
CREATE OR REPLACE FUNCTION per.f_cambiar_dueño_sequences(p_usuario TEXT, p_sequence TEXT)
RETURNS void AS
$BODY$
DECLARE
	CADENA TEXT;

	BEGIN
  	
	CADENA:='ALTER sequence ' || p_sequence || ' OWNER TO '|| p_usuario;
	execute	CADENA;	
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;  
@@ 
CREATE OR REPLACE FUNCTION  err.f_cre_tab_error()
RETURNS void AS
$BODY$

	BEGIN
		CREATE TABLE err.t_error (
			codigo integer NOT NULL,
			cod_error integer,
			cod_usuario integer,
			cod_estatus character(1),
			fec_reporte date,
			fec_respuesta date,
			descripcion character varying(255),
			respuesta character varying(255)
		);
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
@@
CREATE OR REPLACE FUNCTION  err.f_cre_tab_est_error()
RETURNS void AS
$BODY$

	BEGIN
		  CREATE TABLE err.t_est_error (
			codigo character varying(1) NOT NULL,
			nombre character varying
		);
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

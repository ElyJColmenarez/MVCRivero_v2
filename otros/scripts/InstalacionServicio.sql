--	Script que permite crear los procedimientos de almacenado para la administración de 
--instalación.
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
----------------------------------------Instalación---------------------------------------------------------------

-------------------------------Asignar dueño de base de datos------------------------------------------------------
--Función que permite asignarle a un usuario el privilegio de ser dueño de la base de datos creada.
--Parámetros de entrada: p_nom_bas_de_datos: cadena que representa el nombre de la base de datos que 
--se le quiere asignar un dueño.
--						 p_usuario: cadena que representa el nombre del usuario que se quiere hacer dueño de
--la base de datos.
--Valor de retorno: ninguno.
CREATE OR REPLACE FUNCTION  f_asi_due_bas_datos(p_nom_bas_de_datos text, p_usuario text)
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
-----------------------------------------Crear schemas--------------------------------------------------------------
--Función que permite crear todos los esquemas de la aplicación. sis(sistema), per(permiso), err(error),
--aud(auditoría).
--Parámetros de entrada: ninguno. 
--Valor de retorno: ninguno.
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

------------------------------Crear tabla de prueba en el schema sistema(sis)----------------------------------------
--función que permite crear la tabla de prueba del framework t_instituto.
--Parámetros de entrada: ninguno.
--valor de retorno: ninguno.
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
--Sentencia que permite crear la secuencia del id de la tabla t_instituto.
create sequence sis.s_instituto
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
-----------------------------------Crear tablas en schema permiso-----------------------------------------------------
--función que permite crear las tablas t_usuario, t_modulo, t_accion,t_acc_usuario y si son usuarios de 
--base de datos t_tabla y t_tab_accion. Todas ellas se alojarán en el esquema per(permiso).
--Parámetros de entrada: p_tip_usuarios: booleano que identifica el tipo de usuarios, true:usuarios de base
--de datos, false: sin usuarios de base de datos.
--Valor de retorno: ninguno.
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

----------------------------------------Crear tabla usuario-----------------------------------------------------------
--función que permite crear la tabla t_usuario en el esquema per(permiso) donde se alojará la información de los
--usuarios del sistema.
--Parámetros de entrada: ninguno.
--Valor de retorno: ninguno.
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
			cadena:=cadena || 'pass varchar(100) not null, ';
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

----------------------------------------crear tabla módulo-------------------------------------------------------------
--función que permite crear la tabla t_modulo en el esquema per(permiso) donde se alojará la información de los
--módulos del sistema.
--Parámetros de entrada: ninguno.
--Valor de retorno: ninguno.
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
----------------------------------------crear tabla acción--------------------------------------------------------------
--función que permite crear la tabla t_accion en el esquema per(permiso) donde se alojará la información de las
--acciones del sistema.
--Parámetros de entrada: ninguno.
--Valor de retorno: ninguno.
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
----------------------------------------crear tabla acc_usuario----------------------------------------------------------
--función que permite crear la tabla t_acc_usuario en el esquema per(permiso) donde se alojará la información 
--de las acciones que tienen permiso los usuarios.
--Parámetros de entrada: ninguno.
--Valor de retorno: ninguno.
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
----------------------------------------crear tabla tab_accion------------------------------------------------------------
--función que permite crear la tabla t_tab_accion en el esquema per(permiso) donde se alojará la información
--de los permisos que tiene una acción sobre una tabla. por ejemplo acción de código 1 tiene permiso de 
--'I,D,U' sobre la tabla de código 2.
--Parámetros de entrada: ninguno.
--Valor de retorno: ninguno.
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
----------------------------------------crear tabla tabla-----------------------------------------------------------------
--función que permite crear la tabla t_tabla en el esquema per(permiso) donde se alojará la información de las
--tablas del sistema.
--Parámetros de entrada: ninguno.
--Valor de retorno: ninguno.
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
--Sentencia que permite crear la secuencia del id de la tabla t_usuario.
create sequence per.s_usuario
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
--Sentencia que permite crear la secuencia del id de la tabla t_modulo.
create sequence per.s_modulo
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
--Sentencia que permite crear la secuencia del id de la tabla t_accion.
create sequence per.s_accion
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
--Sentencia que permite crear la secuencia del id de la tabla t_tabla.
create sequence per.s_tabla
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
--Sentencia que permite crear la secuencia del id de la tabla t_tab_accion.
create sequence per.s_tab_accion
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
--Sentencia que permite crear la secuencia del id de la tabla t_acc_usuario.
create sequence per.s_acc_usuario
  start with	 1
  increment by 1
  maxvalue 2147483647
  minvalue 1
  cycle;
------------------------------------------insertar en la tabla instituto--------------------------------------------
--Función que permite insertar institutos en la tabla t_instituto de prueba del framework.
--Parámetros de entrada: ninguno.
--Valor de retorno: ninguno.
CREATE OR REPLACE FUNCTION  per.f_instituto_cargar()
RETURNS void AS
$BODY$
DECLARE
		codigo integer := 0;
	BEGIN
		select nextval('per.s_instituto') into codigo; 
		insert into sis.t_instituto (codigo,nom_corto,nombre,direccion)
		 values (codigo,'IUTFRP', 'Instituto Universitario de Tecnología “Dr. Federico Rivero Palacio”', 'Km 8, Panamericana');

		select nextval('per.s_instituto') into codigo; 
		insert into sis.t_instituto (codigo,nom_corto,nombre,direccion)
		 values (codigo,'CUC', 'Colegio Universitario de Caracas', 'Chacao');
		
		select nextval('per.s_instituto') into codigo; 
		insert into sis.t_instituto (codigo,nom_corto,nombre,direccion)
		 values (codigo,'CULTCA', 'Colegio Universitario de Los Teques Cecilio Acosta', 'Km 23, Panamericana');
			
			
	END;
	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;



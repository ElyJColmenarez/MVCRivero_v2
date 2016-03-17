//Instalacion.js 
//Archivo en el cual se agregan algunas funcionalidades y contenidos de la pantalla de instalación de manera 
//dinámica.
//Autores: Geraldine Castillo 
//		   Jhonny Vielma


//Método que permite utilizar funciones cuando esté cargado todo el DOM.
//Carga el diálogo de los componentes necesarios para la instalación y aplica propiedades a los elementos.
//ver documentación de las funciones llamadas.
//Parámetros de entrada:. ninguno.
//Valor de retorno: ninguno.
$(document).ready(function() {
	conDiaComponentes();
	monHtmComponentes();
	activarSelect();
	hoverPasos();
	iniSwitch();
	hovComponentes();

});

//Permite inicializar los valores de los pasos de la instalación.
var pasInstalacion= new Array();
	pasInstalacion[0]=0;//conexión
	pasInstalacion[1]=0;//base de datos
	pasInstalacion[2]=0;//Administrador
	pasInstalacion[3]=0;
	pasInstalacion[4]=0;
var suiche=false;
var ini=0;
//Función que permite configurar el switch de tipos de usuarios. 
//Parámetros de entrada: ninguno.
//Valor de retorno: ninguno.
function iniSwitch(){
	$("#switch-onColor").bootstrapSwitch();
	$("#switch-onColor").bootstrapSwitch("animate",true);
	$("#switch-onColor").bootstrapSwitch("state",false);
	$("#switch-onColor").bootstrapSwitch("indeterminate",true);
	$("#switch-onColor").bootstrapSwitch("onText","Activado");
	$("#switch-onColor").bootstrapSwitch("offText","Desactivado");
	$("#switch-onColor").bootstrapSwitch("labelText","UsuariosDB");
	$("#switch-onColor").bootstrapSwitch("onColor","success");
	$("#switch-onColor").bootstrapSwitch("offColor","danger");
	$("#switch-onColor").bootstrapSwitch("onSwitchChange",eveSwiches);
	$("#switch-onColor").bootstrapSwitch("size","small");
	

}
//función que permite manejar los eventos de switch para mostrar los diferentes mensaje de usuarios de base
//de datos o no.
//Parámetros de entrada: evento: evento que se realizó sobre él(deslizar o click).
//						 state: booleano que permite ver el estado o valor(false:ninguna opción, true: usuarios 
//					   	 de base de datos y false: no usuarios de base de datos).
//Valor de retorno: ninguno.
function eveSwiches(evento,state){
	
	$("#pop").hide();
	$("#Swit").popover('destroy');
	suiche=true;
	if (state==true){
		cont="<h5><span  class='label label-info'> Usuarios de base de datos activos</span> </h5>";
		cont+="<h5 class='infPopover'>Un usuario de base de datos por cada usuario del sistema.</h5>";
		$("#Swit").popover({title: "", content: cont , placement : "bottom", template : '<div id="pop" class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',html: true});
		$("#Swit").trigger("click");
		
			
	}
	else{
		cont="<h5><center><span  class='label label-danger'> Usuarios de base de datos ";
		cont+="<br> desactivados</span><center></h5>";
		cont+="<h5 class='infPopover'>Un solo usuario de conexión a la base de datos para todos los usuarios del sistema.</h5>";
		$("#Swit").popover({title: "", content: cont , placement : "bottom", template : '<div id="pop" class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',html: true});
		$("#Swit").trigger("click");
		
	}
	if (pasInstalacion[4]==0){
		pasInstalacion[4]=1;
	}

}
//Función que permite activar el switche por primera vez
//Parámetro de entrada: ninguno.
//Valor de retorno: ninguno.
function activarSwitch(){

	if (suiche == false && $("#switch-onColor").bootstrapSwitch("state")==false){
		eveSwiches("click",$("#switch-onColor").bootstrapSwitch("state"));
	}


}
//Función que permite crear el diálogo de componentes necesarios agregándole el encabezado y pie con una
//pequeña descripción del framework.
//Parámetros de entrada: ninguno.
//Valor de retorno: ninguno.
function conDiaComponentes(){
	titulo="<div class='row titModal'><div class='col-md-11'><h5><center class='menExito' >Componentes necesarios para la instalación de  <img src='recursos/imgPropias/fotos/mvc2.png'  height='60' width='60' class='img-circle'></center></h5></div>";
	titulo+='<div class="col-md-1"><a href="javascript:comInstalacion(funSucDialogo)" title="Comprobar componentes">';
	titulo+="<i class='icon-repeat icoComprobar' ></i></a></div>";
						
	titulo+="</div>";
	
	pie="<div class='letPeqPie'>MVCRivero es un framework que permite facilidad para desarrollar aplicaciones web, brindando seguridad dual";
	pie+=" tanto en el lado del servidor como en base de datos. Elaborado en el I.U.T. Region Capital en el 2015-2016.   </div>";
	crearDialogo("componentes","",'',1,"","",true);
	$(pie).appendTo("#componentes .modal-footer");
	$("#componentes .close").remove();
 	$("#componentes .btn-danger").remove();
 	$("#componentes").modal({backdrop:"static"});
 	$("#componentes .modal-header").remove();
 	$(titulo).appendTo("#componentes .modal-body");
	$("#componentes").modal("show");
	contDiaComponentes();
}

//Función que permite colocar visible o no el div(#htmComponentes) de los componentes necesarios cuando 
//se le pasa el cursor sobre el div #insHtml.
//Parámetros de entrada: ninguno.
//Valor de retorno: ninguno.
function hovComponentes(){
	$("#insHtml .instalacion").hover(function(){ $("#htmComponentes").show() },
									function(){  $("#htmComponentes").hide()}
									 );
}

//función que permite montar las imágenes de los componenetes necesarios para la instalación. Compara si 
//está instalado o es la versión para colocar respectivamente el ícono de chequeado, no instalado o advertencia
//si no es la versión mínima requerida.
//Parámetros de entrada: tipo: booleano que nos identificará si se va a colocar la información en el diálogo de
//						 componentes o al lado de los campos para la creación de la aplicación.
//					   	 height: entero que permite colocar la altura de las imágenes de los componentes.
//						 width: entero que permite colocar el ancho de las imágenes de los componentes
//Valor de retorno: cadena: cadena que contendrá todo el html con los componentes necesarios.

function armComponentes(tipo=false,height=30,width=40){
	cadena="";
	if (tipo==false  && ini==0){ 
		$("#htmComponentes").hide();
		ini=1;
	}

	ok = "<i class='icon-ok' style='color:#53FF00;'></i>";
	warn= "<i class='icon-exclamation-sign' style='color:#C9C902;'></i>";
	no = "<i class='icon-remove' style='color:red'></i>";
	ast= "<i style='color:red;font-weight:bold'>*</i>";
	esValVerPhp=comVersion("5.3.3",$("#verPhp").val());
	esValVerPostgres=comVersion("9.1",$("#verPostgres").val());
	cadena+="<div class='row'>";
	if(tipo){
		cadena+="<div class='col-md-2'></div>";
		cadena+="<div class='col-md-8'> <img src='recursos/imgPropias/fotos/php.jpg'  height="+height+" width="+width+" class='img-circle'> Versión de PHP <i style='color:red;font-weight:bold'>5.3.3 o superior</i></div>";
		cadena+="<div class='col-md-2'> ";
	}else{
		cadena+="<div class='col-md-10 letPequena'> <img src='recursos/imgPropias/fotos/php.jpg'  height="+height+" width="+width+" class='img-circle'> Versión de PHP<i style='color:red;font-weight:bold'>5.3.3 o superior</i></div>";
		cadena+="<div class='col-md-2'> ";

	}
	if (esValVerPhp)
		cadena+=ok;
	else 
		cadena+=warn;
	cadena+=" </div>";
	cadena+="</div> ";
	cadena+=" <div class='row'>";
	if(tipo){
		cadena+="<div class='col-md-2'> </div>";
		cadena+="<div class='col-md-8'> <img src='recursos/imgPropias/fotos/ins_postgres.jpg'  height="+height+" width="+width+" class='img-circle'> Versión Postgresql<i style='color:red;font-weight:bold'> 9.1 o superior</i>"+ast+" </div>";
		cadena+="<div class='col-md-2'> ";
	}else{
		cadena+="<div class='col-md-10 letPequena'> <img src='recursos/imgPropias/fotos/ins_postgres.jpg'  height="+height+" width="+width+" class='img-circle'> Versión Postgresql<i style='color:red;font-weight:bold'> 9.1 o superior</i>"+ast+" </div>";
		cadena+="<div class='col-md-2'> "
	}
	if (($("#postgres").val()=="true")||($("#postgres").val()=="1")){
		if (esValVerPostgres)
			cadena+=ok;
		else
			cadena+=warn;
	}
	else{

		cadena+=no;
	}
	cadena+=" </div>";
	cadena+="</div> ";
	cadena+="<div class='row'>";
	if(tipo){
		cadena+="<div class='col-md-2'> </div>";
		cadena+="<div class='col-md-8'> <img src='recursos/imgPropias/fotos/pdo.jpg'  height="+height+" width="+width+" class='img-circle'> PDO"+ast+"</div>";
		cadena+="<div class='col-md-2'> ";
	}else{
		cadena+="<div class='col-md-10 letPequena'> <img src='recursos/imgPropias/fotos/pdo.jpg'  height="+height+" width="+width+" class='img-circle'> PDO"+ast+"</div>";
		cadena+="<div class='col-md-2'> ";
	}
	if (($("#pdo").val()=='true') || ($("#pdo").val()=='1') ){
		cadena+=ok;
		
	}else{
		cadena+=no;
		
	}
	cadena+=" </div>";
	cadena+="</div> ";
	cadena+="<div class='row'>";
	if(tipo){
		cadena+="<div class='col-md-2'> </div>";
		cadena+="<div class='col-md-8'> <img src='recursos/imgPropias/fotos/conector.jpg'  height="+height+" width="+width+" class='img-thumbnail'> Conector a Postgresql"+ast+"</div>";
		cadena+="<div class='col-md-2'> ";
	}else{
		cadena+="<div class='col-md-10 letPequena'> <img src='recursos/imgPropias/fotos/conector.jpg'  height="+height+" width="+width+" class='img-thumbnail'> Conector a Postgresql"+ast+"</div>";
		cadena+="<div class='col-md-2'> ";
	}
	if (($("#conPostgres").val()=="true")||($("#conPostgres").val()=="1")){
		cadena+=ok;
	}else
		cadena+=no;
	cadena+=" </div>";
	cadena+="</div> ";
	cadena+="<div class='row'>";
	if(tipo){
		cadena+="<div class='col-md-2'> </div>";
		cadena+="<div class='col-md-8'><img src='recursos/imgPropias/fotos/error.jpg'  height="+height+" width="+width+" class='img-circle'> Display_errors</div>";
		cadena+="<div class='col-md-2'> ";
	}else{
		cadena+="<div class='col-md-10 letPequena'><img src='recursos/imgPropias/fotos/error.jpg'  height="+height+" width="+width+" class='img-circle'> Display_errors</div>";
		cadena+="<div class='col-md-2'> ";

	}
	if (($("#disErrors").val()=="1")||($("#disErrors").val()=="true")){
		cadena+=ok;
	}else
		cadena+=no;
	cadena+="</div>";
	cadena+="</div> ";

	cadena+="<div class='row'>";
	if(tipo){
		cadena+="<div class='col-md-2'> </div>";
		cadena+="<div class='col-md-8'> <img src='recursos/imgPropias/fotos/permisos.png'  height="+height+" width="+width+" class='img-circle'> Permiso de escritura sobre directorio"+ast+"</div>";
		cadena+="<div class='col-md-2'> ";
	}else{
		cadena+="<div class='col-md-10 letPequena'><img src='recursos/imgPropias/fotos/permisos.png'  height="+height+" width="+width+" class='img-circle'> Permiso de escritura sobre directorio"+ast+"</div>";
		cadena+="<div class='col-md-2'> ";

	}
	if (($("#permisos").val()=="1")||($("#permisos").val()=="true")){
		cadena+=ok;
	}else
		cadena+=no;
	cadena+="</div>";
	cadena+="</div> ";
	
		cadena+= "<hr>";
	if (tipo){
		cadena+="<div class='row'>";
		cadena+="<div class='col-md-9'>";
	}
	cadena+= "<h5 class='letPequena'><div class= 'row leyenda'> <div class='col-md-12'>Componente instalado "+ok+"</div></div>";
	cadena+= "<div class= 'row leyenda'> <div class='col-md-12'> Componente no instalado "+no+"</div></div>";
	cadena+= "<div class= 'row leyenda'> <div class='col-md-12'> Componente instalado pero no cumple la mínima version "+warn+"</div></div></h5>";


	if (tipo){
		cadena+="</div>";
		cadena+="<div class='col-md-3'>";
		if ((($("#pdo").val()=='true') || ($("#pdo").val()=='1')) && (($("#conPostgres").val()=="true")||($("#conPostgres").val()=="1")) && (($("#postgres").val()=="true")||($("#postgres").val()=="1")) && (($("#permisos").val()=="true")||($("#permisos").val()=="1")))
			cadena+='<button type="button" class="btn btn-success " onclick="cerrar()">Instalar <i class="icon-forward"></i></button>';
		else 
			cadena+=' <button disabled type="button" class="btn btn-success" onclick="cerrar()">Instalar <i class="icon-forward"></i></button>';
		cadena+="</div>";
		cadena+="</div>";
		cadena+="<h5 class='letPeqRoja'><div class='row'> <div class='col-md-12'>NOTA: de faltar algún componente marcado con * no se procederá con la instalación del software</div></div></h5>";
	}
	
	return cadena;
}
//función que permite agregar los componentes necesarios en el cuerpo del diálogo.
//Parámetros de entrada: ninguno.
//Valor de retorno: ninguno.
function contDiaComponentes(){
	
	cadena="<div class= 'container'> ";
	cadena+="<div id= 'infComponentes'>";
	cadena+=armComponentes(true);
	
	cadena+="</div> ";
	cadena+="</div> ";

	$(cadena).appendTo("#componentes .modal-body");

}
//función que permite enviar una petición al servidor con la acción de comprobar instlación.
//Parámetros de entrada: funSucces: Función que será ejecutada cuando el servidor devuelva una respuesta.
//Valor de retorno: ninguno.
function comInstalacion(funSucces) {
	
	var a=Array("m_modulo","instalacion","m_accion","comInstalacion"
			);
	ajaxMVC(a,funSucces,error);
}
//función que permite agregar los componentes necesarios al lado de los campos para la creación de la aplicación.
//Parámetros de entrada: ninguno.
//Valor de retorno: ninguno.
function monHtmComponentes(){
	$(armComponentes()).appendTo('#infHtmComponentes');

}
//Función que permite llenar los input donde se encuentran las versiones y si está instalado o no el componente.
//Parámetros de entrada: data: objeto que contiene la información estraída del servidor.
//Valor de retorno: ninguno.
function lleHidInstalacion(data){
	
	$("#pdo").val(data.Componentes.pdo);
	$("#conPostgres").val(data.Componentes.conPostgres);
	$("#postgres").val(data.Componentes.postgres);
	$("#verPhp").val(data.Componentes.verPhp);
	$("#verPostgres").val(data.Componentes.verPostgres);
	$("#disErrors").val(data.Componentes.disErrors);


}
//función que permite llenar los valores de las versiones y si están instalados o no los componentes,
//remueve la información del cuerpo del diálogo y rearmará la misma dependiendo de los nuevos valores 
//enviados desde el servidor.
//Parámetros de entrada: data: objeto que contiene la respuesta del servidor.
//Valor de retorno: ninguno.
function funSucDialogo(data){
	lleHidInstalacion(data);
	$("#infComponentes").remove();
	row="<div id='infComponentes'>";
	$(row).appendTo("#componentes .modal-body");
	funSucHtml(data);
	$(armComponentes(true)).appendTo("#infComponentes");
}
//función que permite llenar los valores de las versiones y si están instalados o no los componentes,
//remueve la información de componenetes necesarios que está al lado de los campos para la instalación de la
//aplicación y rearmará la misma dependiendo de los nuevos valores enviados desde el servidor.
//Parámetros de entrada: data: objeto que contiene la respuesta del servidor.
//Valor de retorno: ninguno.
function funSucHtml(data){
	lleHidInstalacion(data);
	$("#infHtmComponentes").remove();
	row="<div class='row instalacion' id='infHtmComponentes'></div>";
	$(row).appendTo("#htmComponentes");
	$(armComponentes()).appendTo("#infHtmComponentes");	
}
//función que permite comprobar las versiones de los componentes.
//Parámeros de entrada: verRequerida: cadena que representa la versión del usuario.
//						verServidor: cadena que representa la versión del servidor.
//Valor de retorno: true: en caso de ser igual o mayor.
//				    false: en caso de ser menor. 
function comVersion(verRequerida,verServidor){
	servidor=verServidor.split(".");
	requerida=verRequerida.split(".");

	for (var i=0; i<requerida.length;i++){

		if (servidor[i]>requerida[i]){
			return true;

		}

		if (servidor[i]<requerida[i]){
			return false;
		}
	}
	return true;
}	
//función que permite cerrar el diálogo de componentes necesarios.
//Parámetros de entrada: ninguno.
//Valor de retorno: ninguno.
function cerrar(){
	$("#componentes").modal("hide");
}
//Función que permite validar los campos para la creación de la aplicación.
//Parámetro de entrada: ninguno
//Valor de retorno: true: en caso de cumplir con todas la validaciones.
//					false: en caso de no cumplir con todas la validaciones.
function valCampos(){
	if (requerido("#usuario") && requerido("#contraseña") && requerido("#servidor")
	&& validarSoloNumeros('#puerto',1,10,true) && validarSoloTexto('#nombre',2,20,true)
	&& validarSoloTexto('#apellido',2,20,true)&&requerido("#nomUsuario")&&requerido("#conUsuario")
	&& requerido("#nomBD")&& requerido("#nomAplicacion")&&requerido("#abrAplicacion")
	&& valNoInput("#basDeDatos","#selBasDatos","seleccione la base de datos")
	&& valNoInput("#codificacion","#selCodificacion","Seleccione la codificación ")
	&& comContraseña("#conUsuario","#conUsuario2")
	&& valSwich("#Swit","Active o desactive los usuarios de base de datos",suiche))
		return true;
	return false;
}
//Función que permite validar los campos para enviar la información y crear la aplicación.
//Parámetros de entrada: ninguna.
//Valor de retorno: ninguno.
function creAplicacion(){
	if (valCampos()){
		
		manDatos();
		
	}
}
//Función que permite enviar la información de los campos al servidor para la creación de la aplicación.
//Parámetros de entrada: ninguna.
//Valor de retorno: ninguno.
function manDatos(){
	var usuBD=$("#switch-onColor").bootstrapSwitch("state");

	var a=Array("m_modulo","instalacion","m_accion","instalar",
			    "usuario",$("#usuario").val(),"contraseña",$("#contraseña").val(),
			    "servidor",$("#servidor").val(),"puerto",$("#puerto").val(),
			    "basDatos",$("#basDeDatos").val(),"nomBasDatos",$("#nomBD").val(),
			    "codificacion",$("#codificacion").val(),"nombre",$("#nombre").val(),
			    "apellido",$("#apellido").val(),"nomUsuario",$("#nomUsuario").val(),
			    "conUsuario",$("#conUsuario").val(),"nomAplicacion",$("#nomAplicacion").val(),
			    "abrAplicacion",$("#abrAplicacion").val(),"pasInstalacion",pasInstalacion,
			    "usuariosBD",usuBD);
	ajaxMVC(a,succEnviar,error);
}
//Función que permite verificar la respuesta del servidor cuando la acción es instalar la aplicación y comprobar
//los pasos de la instalación.
//Parámetros de entrada: data: objeto que contiene la respuesta del servidor.
//Valor de retorno: ninguno.
function succEnviar(data){
	if (data.estatus==-1)
		mostrarMensaje(data.mensaje,2);
	comPasInstalacion(data);
}
//Función que permite comprobar los pasos de la instalación(parámetros de conexión al sistema gestor 
//de base de datos, información de la base de datos a crear, datos del administrador de la aplicación
//y de la base de datos, datos de la aplicación a crear y tipos de usuarios) y enviar los mensajes respectivos
//si los pasos se cumplieron. Cargar la barra de progreso de la creación y si está completa abrirá el diálogo
//de iniciar sesión.
//Parámetros de entrada: data: objeto que contiene la respuesta del servidor.
//Valor de retorno: ninguno.
	
function comPasInstalacion(data){
	if((pasInstalacion[0]==0)&&(data.Instalacion.pasos[0]==1)){

		mostrarMensaje("Conexión establecida <i class='icon-ok' style='color:#53FF00;'></i>",1)
	}
	if((pasInstalacion[1]==0)&&(data.Instalacion.pasos[1]==1)){

		mostrarMensaje("Base de datos creada <i class='icon-ok' style='color:#53FF00;'></i>",1)
	}
	if((pasInstalacion[2]==0)&&(data.Instalacion.pasos[2]==1)){

		mostrarMensaje("Administrador creado <i class='icon-ok' style='color:#53FF00;'></i>",1)
	}
	pasInstalacion[0]=data.Instalacion.pasos[0];
	pasInstalacion[1]=data.Instalacion.pasos[1];
	pasInstalacion[2]=data.Instalacion.pasos[2];
	pasInstalacion[3]=data.Instalacion.pasos[3];
	barProgreso();
	
	if ((pasInstalacion[0]==1) && (pasInstalacion[1]==1) && (pasInstalacion[2]==1) && (pasInstalacion[3]==1)
		&& (pasInstalacion[4]==1)){
		$("#nombreAplicacionLogin").val($("#nomAplicacion").val());
		mosDialogo();
		dialogoSesion();
		$(".alert-success").remove();
		$("#switch-onColor").bootstrapSwitch("disabled",true);
		$("#pop").hide();
		$("#Swit").popover('destroy');


	}else 
		if(data.estatus != -1)
			manDatos()


}
//Función que permite sumar en la barra de progreso si uno o varios pasos están correctos y de ser así colocará
//en azul los botones que representan los pasos.
//Parámetro de entrada:ninguno.
//Valor de retorno: ninguno.
function barProgreso(){
	var color="";
	var sumaPasos=0;
	for (var i=0;i<5; i++){
		if (pasInstalacion[i]==1){

			if((i==4  && pasInstalacion[3]==1) ||( (i==0) || (i==1) || (i==2) || (i==3)) ) {
				//alert("entro "+i);
				$("#spanPaso"+(i+1)).remove();
				$("<span id='spanPaso"+(i+1)+"' class='label label-info'> paso "+(i+1)+" <i class='icon-ok' style='color:#53FF00;'></i> </span>").appendTo("#paso"+(i+1));
				sumaPasos+=20;
				$("."+(i+1)).prop("disabled",true);
			}
		}else{
			if(i==0)       color="label-info";
			else if (i==1) color="label-success";
			else if (i==2) color="label-warning";
			else if (i==3) color="spanPaso4";
			else if (i==4) color="spanPaso5";
			$("#spanPaso"+(i+1)).remove();
			$("<span id='spanPaso"+(i+1)+"' class='label  "+color+"'> paso "+(i+1)+" <i class='icon-remove' style='color:red;'></i> </span>").appendTo("#paso"+(i+1));
			$("."+(i+1)).prop("disabled",false);
			color="";
		}
	}
	
	$("#barraProgreso").css("width",sumaPasos+"%");
	$("#progresoTexto").remove();
	$("<span id= 'progresoTexto'>"+sumaPasos+"% Completado </span>").appendTo("#barraProgreso");
}
//Función que permite agregar la opción al menú de Instituto, crear el diálogo de instalación exitosa
//con el link a dicho módulo.
//Parámetros de entrada: ninguno.
//Valor de retorno: ninguno.
function mosDialogo(){
	$("<ul class='dropdown-menu' role='menu'><li><a href='index.php?m_modulo=instituto&m_formato=html5&m_accion=listar&m_vista=Listar'>Institutos</a></li>").appendTo("#menuS")
	crearDialogo("finInstalacion","",'',1,"","",true);

	contenido="<center><h4 class='menExito'>¡Se ha instalado MVCRivero con éxito!</h4> <img src='recursos/imgPropias/fotos/Mvc.png'  height='100' width='100' class='img-circle'></center>";
	contenido+='<center><h4><a href="index.php?m_modulo=instituto&m_formato=html5&m_accion=listar&m_vista=Listar">';

	contenido+="<span  class='label label-info'> Ir a módulo de prueba";
	contenido+="</span></a></h4></center>";
	$("#finInstalacion .btn-danger").remove();
	pie="<h5 class='pieModalFinal'>NOTA: Si desea eliminar lo ya realizado usted debe dirigirse a la raíz del MVCRivero y borrar el archivo config.ini,  eliminar el usuario administrador creado y la base de datos manualmente, el MVC lo enviará al módulo de instalación nuevamente. Gracias por utilizar MVCRivero</h5>";
	pie+="<button class='btn btn-danger' data-dismiss='modal' type='button'>  Cerrar </button>"
	$(pie).appendTo("#finInstalacion .modal-footer");
	$(contenido).appendTo("#finInstalacion .modal-body");
	$("#finInstalacion .modal-header").remove();
	$("#finInstalacion").modal("show");

	$("#finInstalacion .close").remove();
 	$("#finInstalacion .btn-danger").remove();
 	$("#finInstalacion").modal({backdrop:"static"});


}
//función que permite mostrar la ayuda para cada uno de los pasos cuando se pasa el cursor encima de los campos, 
//título del paso o botón que se encuentra sobre la barra de progreso. 
//Parámetro de entrada: ninguno.
//Valor de retorno: ninguno.
function hoverPasos(){
	$('.divBaseDeDatos').hover(function () {
		$("#hoverPaso2").remove();
		cadena="<div id='hoverPaso2' class='row'> <center> <span class='label label-success'>Información de la base de datos a crear (Paso 2)</span></center>";
		cadena+="<div class='col-lg-12'>"
		cadena+="<div class='row'>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-info'>Descripción: </span>información de la base de datos a crear con la codificación de caracteres seleccionada.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-info'>1</span><strong>Nombre de la base de datos:</strong> que se creará para la aplicación. Por ejemplo: sis_con_notas.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-info'>2</span><strong>Codificación: </strong>formato de codificación de caracteres que poseerá la base de datos a crear. Se recomienda utilizar UTF-8.</h5>"
		cadena+="</div>";
		cadena+="</div>";
		cadena+="</div>";
		cadena+="</div>";
		$(cadena).appendTo("#hoverAyuda");
	}, function (){
		$("#hoverPaso2").remove();
	});

	$('.divConexion').hover(function () {
		$("#hoverPaso1").remove();
		cadena="<div id='hoverPaso1' class='row'> <center> <span class='label label-info'>Parámetros de conexión al SGBD (Paso 1)</span></center>";
		cadena+="<div class='col-lg-12'>"
		cadena+="<div class='row'>";		
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-info'>Descripción: </span>parámetros de conexión de un administrador del sistema gestor de base de datos.</h5>"
		cadena+="</div>";

		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-warning'>1</span><strong>Usuario:</strong>con el que se conectará al sistema gestor de base de datos. Ejemplo: postgres.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-warning'>2</span><strong>Contraseña:</strong>correspondiente al usuario.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-warning'>3</span><strong>Servidor:</strong>dirección IP de la máquina donde se encuentra instalado el sistema gestor de base de datos. Ejemplo:localhost.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-warning'>4</span><strong>Puerto:</strong>por el cual se establece la conexión con el SGBD. Ejemplo: 5432.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-warning'>5</span><strong>Base de datos:</strong>SGBD donde se creará la base de datos. Hasta el momento solo está disponible PostgreSQL.</h5>"
		cadena+="</div>";
		cadena+="</div>";
		cadena+="</div>";
		cadena+="</div>";
		$(cadena).appendTo("#hoverAyuda");
	}, function (){
		$("#hoverPaso1").remove();

	});

	$('.divAdministrador').hover(function () {
		$("#hoverPaso3").remove();
		cadena="<div id='hoverPaso3' class='row'> <center> <span class='label label-warning'>Datos del administrador (Paso 3)</span></center>";
		cadena+="<div class='col-lg-12'>"
		cadena+="<div class='row'>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-info'>Descripción: </span> con el nombre de usuario y la contraseña se creará un nuevo usuario de base de datos y con éste podrá conectarse tanto a la aplicación como al SGBD.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-success'>1</span><strong>Nombre: </strong> del administrador.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-success'>2</span><strong>Apellido: </strong> del administrador.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-success'>3</span><strong>Nombre de usuario:  </strong> del administrador de la base de datos y sistema.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-success'>4</span><strong>Contraseña:</strong> correspondiente al usuario administrador. El nombre, apellido y usuario serán guardados en el archivo config.ini, sino elige usuarios de base de datos la contraseña también estará allí.</h5>"
		cadena+="</div>";

		cadena+="</div>";
		cadena+="</div>";
		cadena+="</div>";
		$(cadena).appendTo("#hoverAyuda");
	}, function (){
		$("#hoverPaso3").remove();

	});

	$('.divAplicacion').hover(function () {
		$("#hoverPaso4").remove();
		cadena="<div id='hoverPaso4' class='row'> <center> <span class='label spanPaso4'>Datos de la aplicación a crear (Paso 4)</span></center>";
		cadena+="<div class='col-lg-12'>"
		cadena+="<div class='row'>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-info'>Descripción: </span> nombre y abreviación de la aplicación a crear.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-danger'>1</span><strong>Nombre de la aplicación:</strong> ejemplo: Sistema Control de Notas.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-danger'>2</span><strong> Abreviación de la aplicación:</strong>  nombre corto de la aplicación. Ejemplo(SCN).</h5>"
		cadena+="</div>";

		cadena+="</div>";
		cadena+="</div>";
		cadena+="</div>";
		$(cadena).appendTo("#hoverAyuda");
	}, function (){
		$("#hoverPaso4").remove();
	});
	
	//hover del paso 5
	$(".divUsuario").hover(function(){
		$("#hoverPaso5").remove();
		cadena="<div id='hoverPaso5' class='row'> <center> <span class='label label-primary'>Tipos de usuarios(Paso 5)</span></center>";
		cadena+="<div class='col-lg-12'>";
		cadena+="<div class='row'>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-info'>Descripción: </span> selección de los tipos de usuarios que poseerá la aplicación a crear.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-warning'>1</span><strong>Usuarios de base de datos activados:</strong> un usuario de base de datos por cada usuario del sistema.</h5>"
		cadena+="</div>";
		cadena+="<div class='col-lg-12'> <h5 class='justificar'> <span class='label label-warning'>2</span><strong> Usuarios de base de datos desactivados:</strong> un solo usuario de conexión a la base de datos para todos los usuarios del sistema.</h5>"
		cadena+="</div>";

		cadena+="</div>";
		cadena+="</div>";
		cadena+="</div>";
		$(cadena).appendTo("#hoverAyuda");
	}, function (){
		$("#hoverPaso5").remove();
	});
}


//*****ACCIÒN****ACCIÒN*****ACCIÒN*******ACCIÒN*************ACCIÒN***********ACCIÒN**************ACCIÒN*******ACCIÒN*************
//*****ACCIÒN*******ACCIÒN******ACCIÒN**********ACCIÒN***ACCIÒN******ACCIÒN******ACCIÒN*****ACCIÒN*********ACCIÒN****ACCIÒN******
//********ACCIÒN**ACCIÒN****ACCIÒN***********ACCIÒN**************ACCIÒN********ACCIÒN**ACCIÒN**************ACCIÒN******ACCIÒN****

//----------------------------BLOQUEAR BOTÓN GUARDAR ACCIÓN---------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite bloquear(disable) el botón de guardar acción y limpiar los hidden donde se encuentra
//              el nombre , descripción y modulo de la acción que se esta administrando ya se modificar, agregar o clonar.             
//PARÁMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//-------------------------------------------------------------------------------------------------------------------------
function bloBotAccion(){

	$("#guaAccion").attr("disabled",true);
	$("#nomAccHidden").val($("#nombre").val());
	$("#desAccHidden").val($("#descripcion").val());
	$("#modAccHidden").val($("#modulo").val());
}
//---------------------------------ADMINISTRAR ACCIÓN---------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite administrar el método que se le va a realizar a la acción(eliminar,agregar o modificar)
//              dependiendo de la acción y código pasado por parámetro             
//PARÁMETROS DE ENTRADA: Char    accion       Acción a realizar 'e'= Eliminar, 'm'= Modificar y 'a'=Agregar.
//                       Integer codigo       Código de la acción a agregar, modificar o eliminar.
//VALOR DE RETORNO: 	 No posee.
//-------------------------------------------------------------------------------------------------------------------------
function admAccion(accion,codigo){
	 if (accion =="e"){
    	if (confirm(" Está seguro que desea eliminar la acción"))
    		eliAccion(codigo,sucEliAccion);
    }else
		if (validarRangos("#nombre",1, 30, true) && validarRangos("#descripcion",1,100, false) ){
			if ((accion =="a" || accion=="c") &&   $("#codigo").val()=="" ){
				if(accion=="c")
					if ($("#usubd").val()!="false")
						modEstTabValores();
					
				agrAccion(sucAgrAccion);
				
			}
			if ( accion =="a" &&  $("#codigo").val()!="")
	 			modAccion($("#codigo").val(),sucModAccion);
			if (accion=="m")
				modAccion(codigo,sucModAccion);
		}
}
//---------------------------------AGREGAR ACCIÓN----------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite armar la petición ajax de agregar acción y realizar dicha petición ajax al servidor
//              agregándole a la petición  como success la función pasada por parámetro.             
//PARÁMETROS DE ENTRADA: Function sucAgregar  Función success que se agregara al ajax de agregar(debe poseer como parámetro 'Data').
//VALOR DE RETORNO: 	 No posee.
//-------------------------------------------------------------------------------------------------------------------------------
function agrAccion(sucAgregar){
	opcion=$("#modulo").val();
	if (opcion==null)
		var a=Array("m_modulo","accion","m_accion","agregar","nombre",$("#nombre").val(),"descripcion",
		$("#descripcion").val()
				);
	else {
		modulo=opcion[0];
		var a=Array("m_modulo","accion","m_accion","agregar","nombre",$("#nombre").val(),"descripcion",
		$("#descripcion").val(),"codModulo",modulo
				);
	}
	ajaxMVC(a,sucAgregar,error);
}
//---------------------------------MODIFICAR ACCIÓN----------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite armar la petición ajax de modificar acción y realizar dicha petición ajax al servidor
//              agregándole a la petición  como success la función pasada por parámetro(sucModificar).             
//PARÁMETROS DE ENTRADA: Integer  codigo        Código de la acción a modificar.
//                       Function sucModificar  Función success que se agregara al ajax de modificar(debe poseer como parámetro 'Data').
//VALOR DE RETORNO: 	 No posee.
//-------------------------------------------------------------------------------------------------------------------------------
function modAccion(codigo,sucModificar){

	opcion=$("#modulo").val();
	if (opcion==null)
	var a=Array("m_modulo","accion","m_accion","modificar","nombre",$("#nombre").val(),"descripcion",
			$("#descripcion").val(),"codigo",codigo
		)	;
	else{
		var modulo=opcion[0];
		var a=Array("m_modulo","accion","m_accion","modificar","nombre",$("#nombre").val(),"descripcion",
			$("#descripcion").val(),"codigo",codigo	,"codModulo",modulo
		)	;
	}
	ajaxMVC(a,sucModificar,error);
}

//---------------------------------SUCCESS AGREGAR ACCIÓN----------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función succes que se ejecuta cuando es llamada en el ajax de agregar acción, esta función permite mostrar el mensaje
//              de lo ocurrido en el servidor y de ser exitoso, asigna los valores de la acción, cambia la ventana a modificar, manda 
//              manda a guardar los permisos en tabla asociados a la acción y desactiva los botones.             
//PARÁMETROS DE ENTRADA: Object   Data     Objeto donde se encuentra la información obtenida del servidor y sus respuestas.
//VALOR DE RETORNO: 	 No posee.
//------------------------------------------------------------------------------------------------------------------------------------
function sucAgrAccion(data){	
	if (data.estatus>0){
		mostrarMensaje(data.mensaje,1);
		$("#codigo").val(data.codAccion);
		$("#estAgrModificado").val("modificar");
		$("#patronAcciones").val(data.codAccion);
		busAcciones();
		$("#infAccion #titAccion").html("Modificar acción" );
		$("#guaAccion").remove();
		boton='<button id="guaAccion" disabled type="button" disabled class="btn btn-success" title="Guardar" onclick=\'admAccion("m",'+data.codAccion+')\'>Guardar</button>';
		$(boton).appendTo("#cenBtnGuardar");
		$("#resValores").attr("disabled",true);
		bloBotAccion();
		guaTabAccion();
	}else 
		mostrarMensaje(data.mensaje,2);
}
//---------------------------------SUCCESS MODIFICAR ACCIÓN----------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función succes que se ejecuta cuando es llamada en el ajax de MODIFICAR acción, esta función permite mostrar el mensaje
//              de lo ocurrido en el servidor y de ser exitoso ,manda a guardar los permisos en tabla asociados a la acción y desactiva los botones.             
//PARÁMETROS DE ENTRADA: Object   Data     Objeto donde se encuentra la información obtenida del servidor y sus respuestas.
//VALOR DE RETORNO: 	 No posee.
//------------------------------------------------------------------------------------------------------------------------------------
function sucModAccion(data){
	if (data.estatus>0){
		mostrarMensaje(data.mensaje,1);
		$("#patronAcciones").val(data.codigo);
		busAcciones();
		bloBotAccion();
		guaTabAccion();
		if ($("#usubd").val()!="false")
			resPerUsuAsoAccion(data.codigo);
		$("#resValores").attr("disabled",true);
	}else 
		mostrarMensaje(data.mensaje,2);
}
//---------------------------------CAMBIAR PANTALLA DE ADMINISTRAR ACCIÓN--------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite armar y mostrar la pantalla de administrar una acción, ya sea para agregar, modificar o clonar una acción 
//              dependiendo de la acción pasada por parámetro ya que arma todo el html necesario para que se ejecute dicha acción y de
// 				ser usuarios de base de datos  carga la permisologìa en tablas de la acción.             
//PARÁMETROS DE ENTRADA: Char    accion      Acción que se debe mostrar en pantalla 'c'=clonar, 'a'=Agregar y 'm'=Modificar.
//						 Integer codigo      Código de la acción que se modificara o clonara
//VALOR DE RETORNO: 	 No posee.
//------------------------------------------------------------------------------------------------------------------------------------
function camAccion(accion='a',codigo=null){
	indi=0;
	$("#infAccion").remove();

	modulos=filModulos(lleSelModulos,"");

	html="<div class='row' id='infAccion'>";
	if (accion=="a"){
		html+="<div class='panel titNegro'>";
		html+='<div class="panel-heading">';
			html+='<div class="row">';
				html+='<div class="col-lg-11">';
					html+="<center><h5 id ='titAccion' class='titBold letBlancas'> Agregar acción </h5> </center>";
				html+='</div>';
				html+='<div class="col-lg-1"><center> <a href="otros/manuales/usuario/index.html#agregarAccion" target="_blank"> <i  title="Ayuda"class="glyphicon glyphicon-question-sign iconoAyuda"></i> </a><center> </div>';
			html+='</div>';
		html+='</div>';
	}

	if (accion=="c"){
		html+="<div class='panel titNegro'>";
		html+='<div class="panel-heading">';
			html+='<div class="row">';
				html+="<center><h5 id ='titAccion' class='titBold letBlancas'> Clonar Accion  </h5> <center>";
			html+='</div>';
		html+='</div>';
	}

	if (accion == "m"){
		html+="<div class='panel titNegro'>";
		html+='<div class="panel-heading">';
			html+='<div class="row">';
				html+='<div class="col-lg-11">';
					html+="<center><h5 id ='titAccion' class='titBold letBlancas'> Modificar acción </h5> <center>";
				html+='</div>';
				html+='<div class="col-lg-1"><center> <a href="otros/manuales/usuario/index.html#modificarAccion" target="_blank"> <i  title="Ayuda"class="glyphicon glyphicon-question-sign iconoAyuda"></i> </a><center> </div>';
			html+='</div>';
		html+='</div>';
	}
/////////////////////////////////////////////////////////////////

	html+='<div class="list-group">';
	html+='<div class="list-group-item">'; 

	html+="<div class='row'>";
		html+='<div class=col-md-12>';
			html+=" <h4 class='titBold'> Información Básica</h4> <hr> ";
		html+='</div>';
	html+='</div>';

	html+='<div class="row">';

		html+="<div class='col-md-6'>";

			html+='<div class="input-group">';
		  	html+='<span class="input-group-addon" title="Código"><i class="icon-qrcode"></i></span>';
		  	html+='<input type="text" disabled class="form-control 1" placeholder="Código" id="codigo"> </div>';
		  	html+='<input type="hidden"   id="nomAccHidden"> ';
		  	html+='<input type="hidden"   id="desAccHidden"> ';
		  	html+='<input type="hidden"   id="modAccHidden"> ';
		html+="</div>";
		html+="<div class='col-md-6'>";
		  	html+='<div class="input-group">';
		  	html+='<span class="input-group-addon" title="Nombre"><i >Nombre</i></span>';
		  	html+='<input oninput="comCambios()" type="text" onkeyup=\'validarRango(nombre,1, 30, true)\' class="form-control 1" placeholder="Nombre" id="nombre"> </div>';
		html+="</div>";

	html+="</div>";
///////////////////////////////////////////////
	html+='<div class="row">';

	

		html+="<div class='col-md-5'>";
			html+='<h5 class="titBold">Descripción<h5><textarea onkeyup=\'validarRangos(descripcion,1,100, false)\' oninput="comCambios()" class="form-control" rows="2" id="descripcion" title="Descripción" id="descripcion"></textarea>';
		  	
		html+="</div>";
		html+="<br><div class='col-md-5' id='selModulo'>";
		
			
		html+="</div>";
		html+="<div class='col-md-2'>";
			if(Permisos.ModuloListar)
				html+='<button type="button" class="btn btn-primary btn-default " title="Configuración de módulos" onclick="diaModulo()"><i class="icon-wrench" ></i></button>';
  		html+="</div>";				
	html+="</div> <hr>";


////////////////////////////////////////7



//////////////////////////////////////////////////////
	
	
	if ($("#usubd").val()=='true'){

		html+='<div  id="infTabAccion">'; 
		html+="<div class='container'>";

		html+="<div class='row'>";

			html+="<div class='row '><center><h4 class='titBold'> Tablas relacionadas</h4></center></div><br>";
			html+="<div class='row'>";
			html+="<div class='col-md-7'>";
			html+='<div class="input-group">';
			html+='<span class="input-group-addon" title="buscador de tablas"><i class="icon-search"></i></span>';
			html+='<input type="text" oninput=\'infAccTabla('+codigo+',"patTabAccion")\' class="form-control 1" placeholder="Buscador de tablas" id="patTabAccion"></div></div>';
			html+="<div class='col-md-1'>";
			if(Permisos.TablaListar)
				html+='<button type="button" class="btn btn-primary btn-info " title="Configuración de tablas" onclick="AbrModTablas()"><i class="icon-wrench" ></i></button>';
			html+="</div>";
			html+="<div class='col-md-4'>";
			html+=' <button class="btn btn-default btn-sm dropdown-toggle btn-warning" disabled id="resValores" title="Restablecer valores " onclick="resValores()" type="button"  aria-haspopup="true" aria-expanded="false">Restablecer</button>';
			html+="</div>";
			html+="</div>";

			html+="</div>";	



		html+="</div><br>";
		html+="</div>";
		html+='<br><div class="row">';
	}
		html+="<center id='cenBtnGuardar'><button id='guaAccion' type='button' disabled class='btn btn-success' title='Guardar' onclick=\"admAccion('"+accion+"',"+codigo+")\">Guardar</button></center";
  		
	html+="</div>";
	html+="</div>";
	html+="</div>";



	html+="</div>";
	html+="</div>";

	if ($("#usubd").val()!="false")
		infAccTabla(codigo);

	$(html).appendTo("#agrModAccion");
	if (accion=="m")
		preModAccion(codigo,sucPreModAccion);
	if (accion=="c"){
		preModAccion(codigo,sucPreCloAccion);
	}
}

//---------------------------------PRE-MODIFICAR ACCION -------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite armar la petición ajax de obtener la información de la acción que se modificara la del código 
//              pasado por parámetro y agregándole a la petición  como success la función pasada por parámetro(sucPreModificar).             
//PARÁMETROS DE ENTRADA: Integer  codigo           Código de la acción a obtener.
//                       Function sucPreModificar  Función success que se agregara al ajax de PreModificar(debe poseer como parámetro 'Data').
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function preModAccion(codigo,sucPreModificar){
	var a=Array("m_modulo","accion","m_accion","obtener","codigo",codigo);
	ajaxMVC(a,sucPreModificar,error);
}
//---------------------------------SUCCESS PRE-MODIFICAR ACCION-------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite asignar a los input de la accion a modificar su informacion obtenida de la base de datos.             
//PARÁMETROS DE ENTRADA: Object   Data     Objeto donde se encuentra la información obtenida del servidor y sus respuestas.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------------
function sucPreModAccion(data){
	if (data.estatus>0){
		accion=data.accion[0];
		$("#codigo").val(accion.codigo);
		$("#nombre").val(accion.nombre);
		$("#descripcion").val(accion.descripcion);
		$("#nomAccHidden").val(accion.nombre);
		$("#desAccHidden").val(accion.descripcion);
		$("#modAccHidden").val(accion.codModulo);
		if (accion.codModulo==null)
			$('#modulo').selectpicker('val',null);
		else
			$('#modulo').selectpicker('val',accion.codModulo);	
	}else 
		mostrarMensaje(data.mensaje,2)
}
//---------------------------------SUCCESS PRE-CLONAR ACCIÓN---------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite asignar a los input de la acción a clonar su información obtenida de la base de datos.             
//PARÁMETROS DE ENTRADA: Object   Data     Objeto donde se encuentra la información obtenida del servidor y sus respuestas.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------
function sucPreCloAccion(data){
	if (data.estatus>0){
		accion=data.accion[0];
		$("#nombre").val(accion.nombre);
		$("#descripcion").val(accion.descripcion);
		$("#nomAccHidden").val(accion.nombre);
		$("#desAccHidden").val(accion.descripcion);
		$("#modAccHidden").val(accion.codModulo);
		if (accion.codModulo==null)
			$('#modulo').selectpicker('val',null);
		else
			$('#modulo').selectpicker('val',accion.codModulo);	
	}	
	else 
		mostrarMensaje(data.mensaje,2)
}
//---------------------------------BUSCAR ACCIONES -------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite armar y lanzar la petición ajax de obtener la lista de acciones que coincidan con el patron que 
//              se encuentre en el id="patronAcciones" y la respuesta de la peticion se encarga de procesarla la function "sucBusAcciones".             
//PARÁMETROS DE ENTRADA: No posee
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function busAcciones(){
	patron= $("#patronAcciones").val();
	var a=Array("m_modulo","accion","m_accion","mostrar","patron",patron);
	ajaxMVC(a,sucBusAcciones,error);
}

//---------------------------------SUCCESS BUSCAR ACCIONES -------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite armar la lista de acciones contenidas en data.acciones y agregarlas al id panelAcciones de existir acciones
//              y de no existir mostrara un mensaje de acciones no encontradas.             
//PARÁMETROS DE ENTRADA: Object   Data     Objeto donde se encuentra la información obtenida del servidor y sus respuestas.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function sucBusAcciones(data){
	$("#listaAcciones").remove();
	cadena="";
	cadena+="<div class='list-group' id='listaAcciones'>";
	if (data.acciones==null){
		cadena+="<a  href='#' class='list-group-item  accionesElementos'>";
		cadena+="<div class='row'>";
  		cadena+="<div class='col-lg-12'> No se encontraron acciones ";
  		cadena+="</div>";
  		cadena+="</div>"
		cadena+="</a>";
  		cadena+="</div>";
  	}else{
		for (var i=0; i< data.acciones.length;i++){
			cadena+="<a id='"+data.acciones[i]['codigo']+"' href='#' class='list-group-item accionesElementos'> ";
	  		cadena+="<div class='row'>";
	  		cadena+="<div class='col-lg-2'>"+data.acciones[i]['codigo'];
	  		cadena+="</div>";
	  		cadena+="<div class='col-lg-7'>"+data.acciones[i]['nombre'];
	  		cadena+="</div>";
	  		cadena+="<div class='col-lg-1'>";
	  		cadena+="<i id='c"+data.acciones[i]['codigo']+"' onclick=\" camAccion('c',"+data.acciones[i].codigo+" )\" class='iconosAcciones' title='clonar Accion'><img src='recursos/assets/ico/copiar.png'  height='20px' width='20px' class='img-circle iconoClonar '></i>";
	  		cadena+="</div>";
	  		cadena+="<div class='col-lg-1'>";
	  		cadena+="<i id='m"+data.acciones[i]['codigo']+"' onclick=\" camAccion('m',"+data.acciones[i].codigo+" )\" title='Modificar acción' class='icon-pencil iconoModificar iconosAcciones' ></i>";
	  		cadena+="</div>";
	  		cadena+="<div class='col-lg-1'>";
	  		cadena+="<i id='e"+data.acciones[i]['codigo']+"' title='Eliminar Acción'  onclick=\" admAccion('e',"+data.acciones[i].codigo+" )\" class='icon-remove iconoEliminar iconosAcciones'></i>";
	  		cadena+="</div>";
	  		cadena+="</div>"
			cadena+="</a>";
  		}
  		cadena+="</div>";
  	}
  	$(cadena).appendTo("#panelAcciones");
 	ocultarIconos();
 	hoverAcciones();
 	clickAcciones();
 	idClick="";
}

//----------------------------------------HOVER ACCIONES--------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite cargar a todos los elementos que posean la clase "accionesElementos" el efecto de hover en el 
//              cual aparecen los iconos de modificar,clonar y eliminar y al no tener hover el elemento los desaparece.             
//PARÁMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//---------------------------------------------------------------------------------------------------------------------------------
function hoverAcciones(){
	$(".accionesElementos").hover(
				function() {
					$( "#c"+$( this).attr("id")).show();
					if(Permisos.AccionModificar)
						$( "#m"+$( this).attr( "id" )).show();
					if(Permisos.AccionEliminar)
						$( "#e"+$( this).attr( "id" )).show();
					
				},
				function() {
					if (idClick!=$( this).attr("id")) {
						$( "#c"+$( this).attr( "id" )).hide();
						$( "#m"+$( this).attr( "id" )).hide();
						$( "#e"+$( this).attr( "id" )).hide();
					}
				}
	);
}
//----------------------------------------CLICK ACCIONES--------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite cargar a todos los elementos que posean la clase "accionesElementos" el efecto de click en el 
//              cual aparecen los iconos de modificar,clonar y eliminar y colocar el elemento en un backgroun de un color mas oscuro y
//              se le asigna a la variable global idClick el id de la acción.             
//PARÁMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//---------------------------------------------------------------------------------------------------------------------------------
function clickAcciones(){
	$( ".accionesElementos" ).click(
				function() {
					ocultarIconos();
					idClick=$( this).attr("id");
					$( "#c"+$( this).attr("id")).show();
					if(Permisos.AccionModificar)
						$( "#m"+$( this).attr( "id" )).show();
					if(Permisos.AccionEliminar)
						$( "#e"+$( this).attr( "id" )).show();

				}
	);
}

//----------------------------------------DOCUMENT READY--------------------------------------------------------------------------
//DESCRIPCIÓN: 	Permite ejecutar las funciones de hoverAcciones,ocutalIconos y clickAcciones cuando la pagina ya este cargada a un
//              100%.             
//PARÁMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//---------------------------------------------------------------------------------------------------------------------------------
$(document).ready(function() {
	hoverAcciones();
	ocultarIconos();
	clickAcciones();
});

//----------------------------------------OCULTAR ICONOS--------------------------------------------------------------------------
//DESCRIPCIÓN: 	Funcion que permite ocultar los iconos que poseean la clase "iconosAcciones".             
//PARÁMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//---------------------------------------------------------------------------------------------------------------------------------
function ocultarIconos(){
	$(".iconosAcciones").hide();
}
//---------------------------------ELIMINAR ACCIÓN-------------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite armar y lanzar la petición ajax de eliminar una acción, la del código pasado por parámetro  
//              y la respuesta de la petición se encarga de procesarla la función que se pase por parámetro en 'sucEliminar'.             
//PARÁMETROS DE ENTRADA: Integer  codigo        Código de la acción a eliminar.
//						 Function sucEliminar	Función success que se encarga de procesar la respuesta de la petición.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function eliAccion(codigo,sucEliminar){	
	var a=Array("m_modulo","accion","m_accion","eliminar","codigo",codigo);
	ajaxMVC(a,sucEliminar,error);
}
//---------------------------------SUCCESS ELIMINAR ACCIÓN-------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite mostrar el mensaje de la respuesta al eliminar la acción y de ser exitoso refresca la lista de acciones.             
//PARÁMETROS DE ENTRADA: Object   Data     Objeto donde se encuentra la información obtenida del servidor y sus respuestas.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function sucEliAccion(data){
	if (data.estatus>0){
		mostrarMensaje("Acción eliminada",1);
		busAcciones();
		$("#agrModAccion").remove();
		$("<div class='col-lg-6' id='agrModAccion'></div>").appendTo("#conAcciones");
	}else 
		mostrarMensaje(data.mensaje,2);
}

//*****TABLA-ACCION****TABLA-ACCION*****TABLA-ACCION*******TABLA-ACCION*************TABLA-ACCION***********TABLA-ACCION**************
//*****TABLA-ACCION*******TABLA-ACCION******TABLA-ACCION**********TABLA-ACCION***TABLA-ACCION******TABLA-ACCION******TABLA-ACCION****
//********TABLA-ACCION**TABLA-ACCION****TABLA-ACCION***********TABLA-ACCION*******TABLA-ACCION*******TABLA-ACCION**TABLA-ACCION******


//---------------------------------OBTENER INFORMACIÓN ACCIÓN-TABLA(permisos en tabla)-----------------------------------------------
//DESCRIPCIÓN: 	Función que permite obtener armar y ejecutar la petición ajax que obtiene la permisologìa en tablas que posee una acción
//              la del código pasado por parámetro y filtrar en la lista por nombre de tabla con el parámetro id, la función que se encargara.             
//PARÁMETROS DE ENTRADA: Integer  codigo        Código de la acción a obtener permisos en tablas.
//						 String   id 	        Id donde se encuentra el patrón por el cual se quiere filtrar la lista.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
 function infAccTabla(codigo,id=""){
 	if (id!='')
 		obtTabAccion(sucTabAccion,codigo,$("#"+id).val());
 	else 
 		obtTabAccion(sucTabAccion,codigo);
 }

//---------------------------------SUCCESS LISTA TABLA ACCIÓN---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función de success que se encarga de procesar los datos obtenidos del servidor al obtener la lista
//              de permisologìa en tablas de una acción y de ser exitosa la lista llama a la función de monTabAccion
//              que se encargara de mostrarla en pantalla.             
//PARÁMETROS DE ENTRADA: Object   Data     Objeto donde se encuentra la información obtenida del servidor y sus respuestas.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function sucTabAccion(data){
	if (data.estatus>0){
		if (data.tablas==null){
			$("#aciTablas").remove();
			$("#menTabAccion").remove();
			$("<center><h5 id='menTabAccion' class='titBold'>No hay resultados de la búsqueda</h5><center>").appendTo("#infTabAccion");
		}else 
			$("#menTabAccion").remove();
		monTabAccion(data);
	}else 
		mostrarMensaje(data.mensaje,2);
}
//---------------------------------MONTAR ACCIÓN-TABLA---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que remueve la lista de tabla acción (aciTabla) y la remplaza por la nueva lista contenida en data.tablas
//              y la agrega de nuevo a la vista del usuario y comprueba los valores en la variable global tabAcciones, agregando 
//              los que no existan, y modificando a los que tengan valores nuevos.             
//PARÁMETROS DE ENTRADA: Object   Data     Objeto donde se encuentra la información obtenida del servidor y sus respuestas.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function monTabAccion(data){

	$ ("#aciTablas").remove();
	var tablas=data.tablas;	
	var cadena="<div class='container'  id='aciTablas'>";
	cadena+="<div class='row'> <a  class='list-group-item titTabla' >";
    	cadena+="<div class='row titTabla'>";
    	    cadena+="<div class='col-lg-2 '>ID</div>";
            cadena+="<div class='col-lg-5 '>Tablas</div>";
            cadena+="<div class='col-lg-1'><i class='icon-plus-sign icoInsert' title='INSERT' ></i></div>";
            cadena+="<div class='col-lg-1 icoUpdate'><i class='icon-pencil icoUpdate' title='UPDATE'></i></div>";
            cadena+="<div class='col-lg-1 icoDelete'><i class='icon-remove icoDelete' title='DELETE'></i></div>";
            cadena+="<div class='col-lg-1 '><i class='icoSelect' title='SELECT'>S</i></div>";
            cadena+="<div class='col-lg-1  '><i class='azul' title='Marcar Todas'>A</i></div>";
        cadena+="</div>";
    cadena+="</a></div>";

	cadena+="<div class='row' id='accTabla'>";

	if (indi==0){
		tabValores= new Array();
	}	
		
	for (var i=0; i<tablas.length; i++){
		if (indi==0  || tabValores["T"+tablas[i].codTabla]==undefined){
			var arreglo= new Array(4);
			arreglo["codTabla"]=tablas[i].codTabla;
			arreglo["valActual"]="";
			if (tablas[i].permisos!=null){
				arreglo["valInicial"]=tablas[i].permisos;
				arreglo["estatus"]="A";
				arreglo["valActual"]=tablas[i].permisos;
			}else{
				arreglo["valInicial"]="";
				arreglo["estatus"]="N";
			}
			tabValores["T"+ tablas[i].codTabla]=arreglo;
		}

		cadena+="<a id='"+tablas[i].nombre+"'' class='list-group-item ' value='"+tablas[i].codTabla+"'>";
	    cadena+="<div class='row'>";
	    cadena+="<div class='col-lg-2'>"+tablas[i].codTabla+"</div>";
	        cadena+="<div class='col-lg-5'> "+tablas[i].nombre+"</div>";
	        cadena+="<div class='col-lg-1'><input onchange=\"camValCheck("+tablas[i].codTabla+",'I')\"type='checkbox'  id='cheI"+tablas[i].codTabla+"' ></div>";
	        cadena+="<div class='col-lg-1'><input onchange=\"camValCheck("+tablas[i].codTabla+",'U')\" type='checkbox' id='cheU"+tablas[i].codTabla+"' ></div>";
	        cadena+="<div class='col-lg-1'><input onchange=\"camValCheck("+tablas[i].codTabla+",'D')\"type='checkbox'  id='cheD"+tablas[i].codTabla+"' ></div>";
	        cadena+="<div class='col-lg-1'><input onchange=\"camValCheck("+tablas[i].codTabla+",'S')\"type='checkbox'  id='cheS"+tablas[i].codTabla+"'></div>";
	        cadena+="<div class='col-lg-1'><input onchange=\"camValCheckAll("+tablas[i].codTabla+")\"type='checkbox'  id='cheA"+tablas[i].codTabla+"'></div>";
	    cadena+="</div>";
	   	cadena+="</a>";
	}
	cadena+="</div>";
	cadena+="</div>";
	$(cadena).appendTo("#infTabAccion");
	cheTablas();
	indi=1;
}
//---------------------------------CAMBIAR VALOR CHECK ALL---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite cambiar los valores de una tabla cuando se chequea el check de A que es el que permite chequear o 
//              deschequear todo los permisos de esa acción en la tabla y cambiar su valor en la variable global tabAcciones.             
//PARÁMETROS DE ENTRADA: Integer   codigo     Código de la tabla que se cambiaran sus valores de los check.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------

function camValCheckAll(codigo){
	if (estCkequeado("#cheA"+codigo)){
		if (!(estCkequeado("#cheI"+codigo))){
			$("#cheI"+codigo).prop("checked",true);
			camValCheck(codigo,'I');
		}
		if (!(estCkequeado("#cheU"+codigo))){
			$("#cheU"+codigo).prop("checked",true);
			camValCheck(codigo,'U');
		}
		if (!(estCkequeado("#cheS"+codigo))){
			$("#cheS"+codigo).prop("checked",true);
			camValCheck(codigo,'S');
		}
		if (!(estCkequeado("#cheD"+codigo))){
			$("#cheD"+codigo).prop("checked",true);
			camValCheck(codigo,'D');
		}
	}else{

		if (estCkequeado("#cheI"+codigo)){
			$("#cheI"+codigo).prop("checked","");
			camValCheck(codigo,'I');
		}
		if (estCkequeado("#cheU"+codigo)){
			$("#cheU"+codigo).prop("checked","");
			camValCheck(codigo,'U');
		}
		if (estCkequeado("#cheS"+codigo)){
			$("#cheS"+codigo).prop("checked","");
			camValCheck(codigo,'S');
		}
		if (estCkequeado("#cheD"+codigo)){
			$("#cheD"+codigo).prop("checked","");
			camValCheck(codigo,'D');
		}

	}
}
//---------------------------------MODIFICAR PERMISOS---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite eliminar de un string de permisos("IUDS") un permiso en especifico por ejemplo:  eliminar de los 
//              permisos "DIUS" el permisos de "U".             
//PARÁMETROS DE ENTRADA: String   permisos     Cadena que contiene los permisos.
//                       Char     permiso      Permiso a eliminar.
//VALOR DE RETORNO: 	 String   Permisos modificados.
//--------------------------------------------------------------------------------------------------------------------------------------
function modPermisos(permisos,permiso){
	var cadena="";
	for (var i=0;i<permisos.length;i++){
		if (permisos[i]!=permiso)
			cadena+=permisos[i];
	}
	return cadena;
}
//---------------------------------CAMBIAR VALOR TABLA CHEQUEADAS---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite llevar el control de los cambios de una tabla y la permisologìa de la acción en esta, ya que la función
//              permite controlar si hay que modificar, eliminar o agregar una tabla-accion mediante el campo estatus de la variable global
//              tabAccion, elimina de la tabla pasada por parámetro el valor que se pasa por parámetro.             
//PARÁMETROS DE ENTRADA: String   codigo     código de la tabla a modificar permisos.
//                       Char     valor      Permiso a eliminar de la permisologìa de la acción en la tabla.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function camValCheck(codigo,valor){
	valor=valor.toUpperCase();

	if (estCkequeado("#che"+valor+codigo)){
		tabValores["T"+codigo]['valActual']+=valor;
	}
	else 
		tabValores["T"+codigo]["valActual"]=modPermisos(tabValores["T"+codigo]['valActual'],valor);


	var com=comValPermisos(tabValores["T"+codigo]['valInicial'],tabValores["T"+codigo]['valActual']);

	if (!com){

		
		if (tabValores["T"+codigo]['estatus']=="A"){

			if (tabValores["T"+codigo]["valActual"]=="")
				tabValores["T"+codigo]["estatus"]="E";
			else
				tabValores["T"+codigo]["estatus"]="M";
		}else 

			if (tabValores["T"+codigo]['estatus']=="N"){

				if (tabValores["T"+codigo]["valActual"]!="")
					tabValores["T"+codigo]["estatus"]="I";
				
		}else 

			if (tabValores["T"+codigo]['estatus']=="E")
				tabValores["T"+codigo]["estatus"]="M";	
			
		else 	
			if (tabValores["T"+codigo]['estatus']=="M"){
				if (tabValores["T"+codigo]["valActual"]==""){
					tabValores["T"+codigo]["estatus"]="E";
				}	
			}		
	}else{
		if (tabValores["T"+codigo]['estatus']=="E")
			tabValores["T"+codigo]["estatus"]="A";
		else 
			if (tabValores["T"+codigo]['estatus']=="I")
				tabValores["T"+codigo]["estatus"]="N";
		else
			if (tabValores["T"+codigo]['estatus']=="M")
			tabValores["T"+codigo]["estatus"]="A";
	}
	comCambios();
}
//---------------------------------COMPARAR PERMISOS---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite comprobar 2 String de permisos y retorna true de ser iguales y false de no ser iguales.             
//PARÁMETROS DE ENTRADA: String   inicial     Permiso a comparar.
//                       Char     actual      Permiso a comparar.
//VALOR DE RETORNO: 	 Boolean     True de ser iguales, false de ser diferentes.
//--------------------------------------------------------------------------------------------------------------------------------------
function comValPermisos(inicial,actual){
	var inicial=obtPermisos(inicial);
	var actual=obtPermisos(actual);
 	if  (inicial['I']!= actual['I'])
 		return false;
 	if (inicial['U']!= actual['U'])
 		return false;
 	if (inicial['D']!= actual['D'])
 		return false;
 	if (inicial['S']!= actual['S'])
 		return false;
 	return true;
}
//---------------------------------ESTA CHEQUEADO---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite comprobar si el id de un check esta chequeado o no.             
//PARÁMETROS DE ENTRADA: String   idCheck     Id del check a comprobar.
//VALOR DE RETORNO: 	 Boolean     true de esta chequeado y false de no.
//---------------------------------------------------------------------------------------------------------------------------------
function estCkequeado(idCheck){
	return $(idCheck).is(':checked'); 	
}
//---------------------------------DESCHEQUEAR TABLAS---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite deschequear todo los permisos de la accion en todas las tablas.             
//PARÁMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//---------------------------------------------------------------------------------------------------------------------------------
function desTablas(){

	for (var i in tabValores){
			
		$("#cheI"+tabValores[i]["codTabla"]).prop("checked","");
		$("#cheU"+tabValores[i]["codTabla"]).prop("checked","");
		$("#cheD"+tabValores[i]["codTabla"]).prop("checked","");
		$("#cheS"+tabValores[i]["codTabla"]).prop("checked","");
	}
}
//---------------------------------CHEQUEAR TABLAS-------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite chequear todos los permisos que posea un accion en todas las tablas .             
//PARÁMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------
function cheTablas(){
	for (var i in tabValores){
		if (tabValores[i]["valActual"]!=""){
			permisos=obtPermisos(tabValores[i]['valActual']);
			
			if (permisos["I"])
				$("#cheI"+tabValores[i]["codTabla"]).prop("checked",true);
			if (permisos["U"])
				$("#cheU"+tabValores[i]["codTabla"]).prop("checked",true);
			if (permisos["D"])
				$("#cheD"+tabValores[i]["codTabla"]).prop("checked",true);
			if (permisos["S"])
				$("#cheS"+tabValores[i]["codTabla"]).prop("checked",true);
		}
	}
}

//---------------------------------RESTAURAR VALORES -------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite deshacer todos los cambios realizados sobre la permisologìa de acción en tablas.             
//PARÁMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------
function resValores(){
	desTablas();
	camTabValores();
	cheTablas();
	comCambios();
	$("#resValores").attr("disabled",true);

}
//---------------------------------CAMBIAR VALOR ACTUAL TAB-ACCIONES-------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite asignar en la posición actual de la matriz tabValores el valor inicial que es donde se encuentra
//              la permisologìa que posee la acción en la tabla en base de datos .             
//PARÁMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//------------------------------------------------------------------------------------------------------------------------------
function camTabValores(){

	for (var i in tabValores){
			tabValores[i]['valActual']=tabValores[i]['valInicial'];
			tabValores[i]['estatus']='A';
	}
}
//---------------------------------COMPROBAR CAMBIOS-------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite comprobar si existen cambios en la información de una acción y de su permisologìa en tablas
//              para activar o desactivar el botón de guardar.             
//PARÁMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//------------------------------------------------------------------------------------------------------------------------------
function comCambios(){
	var modulo= $("#modAccHidden").val();
	if (modulo==""){
		modulo=null;
	}
	if ($("#usubd").val()!="false")
		var canTabla=verCamTabValores();
	else
		var canTabla=true;


	if (($("#nomAccHidden").val()!=$("#nombre").val())||($("#desAccHidden").val()!=$("#descripcion").val())
		||(modulo!=$("#modulo").val())){
		
		$("#guaAccion").attr("disabled",false);
		
	}else{
		$("#guaAccion").attr("disabled",true);
		$("#resValores").attr("disabled",true);

	}
	

	if (canTabla){
		if ($("#usubd").val()!="false"){
			$("#resValores").attr("disabled",false);
			$("#guaAccion").attr("disabled",false);
		}
	}else{
		if ($("#usubd").val()!="false")
			$("#resValores").attr("disabled",true);
	}
}
//---------------------------------VER CAMBIOS EN TABVALORES-------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite comprobar si existe alguna diferencia en la permisologìa de la acción en las tablas 
//              comparando la posición inicial de la matriz con la posición actual que es la que posee los cambios, y retorna
//              true de existir algún cambio y false de todo estar igual.             
//PARÁMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 Boolean      True de haber cambios y false de estar igual.
//------------------------------------------------------------------------------------------------------------------------------
function verCamTabValores(){
	for (var propiedad in tabValores){
			if ((tabValores[ propiedad]["estatus"]=="I")||(tabValores[ propiedad]["estatus"]=="M")||(tabValores[ propiedad]["estatus"]=="E"))
				return true
	}
	return false;
}
//---------------------------------MODIFICAR ESTATUS TABVALORES-------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite pasar el estatus de todas la tablas de tabValores  de estatus A="agregado en base de datos"
//              a I="insertar en base de datos".             
//PARÁMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//------------------------------------------------------------------------------------------------------------------------------
function modEstTabValores(){

	for (var propiedad in tabValores){
		if ((tabValores[propiedad]["estatus"]=="A") ||(tabValores[propiedad]["estatus"]=="M"))
			tabValores[propiedad]["estatus"]="I";
		
		if (tabValores[propiedad]["estatus"]=="E")
			tabValores[propiedad]["estatus"]="N";
	}
}
//---------------------------------GUARDAR TABVALORES-------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite administrar las tablas que se encuentran en tabValores y mediante el status que tenga la 
//              tabla se agrega, elimina o modifica en la base de datos.             
//PARÁMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//------------------------------------------------------------------------------------------------------------------------------
function guaTabAccion(){

	var tabla;
	
	for (var propiedad in tabValores){
		
		tabla=tabValores[ propiedad];
		 	console.log(tabla['estatus']);
		if (tabla["estatus"]=="I"){
			agrTabAccion(tabla["codTabla"],$("#codigo").val(),tabla["valActual"],sucAgrTabAccion);
			
			
			
		}
		if (tabla["estatus"]=="M")
			modTabAccion(tabla["codTabla"],$("#codigo").val(),tabla["valActual"],sucModTabAccion);
		if (tabla["estatus"]=="E")
			eliTabAccion(tabla["codTabla"],$("#codigo").val(),sucEliTabAccion);
	}
	
	
}
//---------------------------------RESTABLECER PERMISOS USUARIOS ASOCIADOS A ACCION--------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite restablecer los permisos en base de datos de los usuarios que tienes asociada la accion a modificar o eliminar.             
//PARÁMETROS DE ENTRADA: Integer  codAccion     Codigo de la accion.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function resPerUsuAsoAccion(codAccion){
		var a=Array("m_modulo","usuario","m_accion","restablecerPermisosUsuariosAccion","codAccion",codAccion
				);
		ajaxMVC(a,sucResPerUsuAccion,error);
}

function sucResPerUsuAccion(data){
	if(data.estatus>0){
		mostrarMensaje(data.mensaje,1);
	}else
		mostrarMensaje(data.mensaje,2);
		
}
//---------------------------------MODIFICAR TABLA ACCIÓN--------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite obtener armar y ejecutar la petición ajax que modifica la permisologìa de una acción en una tabla
//              la de los códigos  y permisos pasado por parámetro y la función que se encargara de procesar la respuesta del servidor
//              sera la que se pase al parámetro "funSucces".             
//PARÁMETROS DE ENTRADA: Integer  codTabla      Código de la tabla.
//						 Integer  codAccion     Código de la acción.
//						 String   permisos      Permisos actual de la acción en la tabla,
//                       Function funcSucces    Función que se encargara de procesar la respuesta del servidor.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function modTabAccion(codTabla,codAccion,permisos,funSucces){
	var a=Array("m_modulo","accion","m_accion","modTabAccion","codTabla",codTabla,"codAccion",
		codAccion,"permisos",permisos
				);
	ajaxMVC(a,funSucces,error);
}
//---------------------------------ELIMINAR TABLA ACCIÓN--------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite obtener armar y ejecutar la petición ajax que elimina la permisologìa de una acción en una tabla
//              la de los códigos pasado por parámetro y la función que se encargara de procesar la respuesta del servidor
//              sera la que se pase al parámetro "funSucces".             
//PARÁMETROS DE ENTRADA: Integer  codTabla      Código de la tabla.
//						 Integer  codAccion     Código de la acción.
//                       Function funcSucces    Función que se encargara de procesar la respuesta del servidor.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------

function eliTabAccion(codTabla,codAccion,funSucces){
	var a=Array("m_modulo","accion","m_accion","eliTabAccion","codTabla",codTabla,"codAccion",
		codAccion
				);
	ajaxMVC(a,funSucces,error);
}
//---------------------------------SUCCESS ELIMINAR TABLA ACCIÓN---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función de success que se encarga de procesar los datos obtenidos del servidor al eliminar los permisos de una accion en una tabla
//              y reiniciar los valores de la matriz tabValores.         
//PARÁMETROS DE ENTRADA: Object   Data     Objeto donde se encuentra la información obtenida del servidor y sus respuestas.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function sucEliTabAccion(data){
	 if (data.estatus>0){
	 	tabValores["T"+data.codTabla]["estatus"]="N";
	 	tabValores["T"+data.codTabla]["valInicial"]="";
	 	tabValores["T"+data.codTabla]["valActual"]="";
	 }else
	 	mostrarMensaje(data.mensaje,2);

}
//---------------------------------AGREGAR TABLA ACCIÓN--------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite obtener armar y ejecutar la petición ajax que agrega la permisologìa de una acción en una tabla
//              la de los códigos  y permisos pasado por parámetro y la función que se encargara de procesar la respuesta del servidor
//              sera la que se pase al parámetro "funSucces".             
//PARÁMETROS DE ENTRADA: Integer  codTabla      Código de la tabla.
//						 Integer  codAccion     Código de la acción.
//						 String   permisos      Permisos de la acción en la tabla,
//                       Function funcSucces    Función que se encargara de procesar la respuesta del servidor.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function agrTabAccion(codTabla,codAccion,permisos,funSucces){
	var a=Array("m_modulo","accion","m_accion","agrTabAccion","codTabla",codTabla,"codAccion",
		codAccion,"permisos",permisos
				);
	ajaxMVC(a,funSucces,error);
}
//---------------------------------SUCCESS MODIFICAR TABLA ACCIÓN---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función de success que se encarga de procesar los datos obtenidos del servidor al modificar los permisos de una accion en una tabla
//              y reiniciar los valores de la matriz tabValores con los nuevos valores.          
//PARÁMETROS DE ENTRADA: Object   Data     Objeto donde se encuentra la información obtenida del servidor y sus respuestas.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function sucModTabAccion(data){
	 if (data.estatus>0){
	 	tabValores["T"+data.codTabla]["estatus"]="A";
	 	tabValores["T"+data.codTabla]["valInicial"]=tabValores["T"+data.codTabla]["valActual"];
	 } else
	 	mostrarMensaje(data.mensaje,2);
}
//---------------------------------SUCCESS AGREGAR TABLA ACCIÓN---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función de success que se encarga de procesar los datos obtenidos del servidor al agregar los permisos de una accion en una tabla
//              y reiniciar los valores de la matriz tabValores con los valores agregados.          
//PARÁMETROS DE ENTRADA: Object   Data     Objeto donde se encuentra la información obtenida del servidor y sus respuestas.
//VALOR DE RETORNO: 	 No posee.
//--------------------------------------------------------------------------------------------------------------------------------------
function sucAgrTabAccion(data){
	 if (data.estatus>0){
	 	tabValores["T"+data.codTabla]["estatus"]="A";
	 	tabValores["T"+data.codTabla]["valInicial"]=tabValores["T"+data.codTabla]["valActual"];
	 }else
	 	mostrarMensaje(data.mensaje,2);
}
//---------------------------------OBTENER PERMISOS ARRAY---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que retorna un arreglo de permisos dependiendo del string permisos pasado por pasametro, esta funcion tranforma 
//              los permisos en un arreglo donde se podra acceder a la posicion "I","U","D","S".          
//PARÁMETROS DE ENTRADA: String   permisos     Cadena de permisos.
//VALOR DE RETORNO: 	 Array.
//--------------------------------------------------------------------------------------------------------------------------------------

function obtPermisos(permisos){
	var per=new  Array(4);

		for (var i=0; i<permisos.length;i++)
			per[permisos[i]]=true;

		if (per["U"]==undefined) per["U"]==false;
		if (per["D"]==undefined) per["D"]==false;
		if (per["S"]==undefined) per["S"]==false;
		if (per["I"]==undefined) per["I"]==false;

	return per;
}

//*****MODULO****MODULO*****MODULO*******MODULO*************MODULO***********MODULO**************MODULO*******MODULO*************
//*****MODULO*******MODULO******MODULO**********MODULO***MODULO******MODULO******MODULO*****MODULO*********MODULO****MODULO******
//********MODULO**MODULO****MODULO***********MODULO**************MODULO********MODULO**MODULO**************MODULO******MODULO****

//---------------------------------DIÀLOGO MODULO---------------------------------------------------------------------------------
//DESCRIPCIÓN:  Función que permite agregar el encabezado y pie del modal para la administración de módulos 
//				y un llamado a la función filModulos que cargará la lista de módulos, si hay.
//PARÁMETROS DE ENTRADA: Ninguno.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function diaModulo(){
	$("#diaModulo").remove();
	$(".modal").remove();
	crearDialogo("diaModulo","<center><h3 class='titBold'>Configuración de módulos</h3></center>",'',1000,"","",false);
	infModulo();

	filModulos(monModulos);
	$(cadena).appendTo("#diaModulo .modal-body");

	var pie="<div class='row'>";
	pie+="<div class='col-lg-10'></div>";
	pie+="<div class='col-lg-2'><img src='recursos/imgPropias/fotos/mvc2.png'  height='50' width='50' class='img-circle'> </div>";
	pie+=" </div>";
	$(pie).appendTo("#diaModulo .modal-footer");
	$("#diaModulo").modal("show");

}
//---------------------------------MONTAR MODULOS---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite cargar los módulos en un panel.
//PARÁMETROS DE ENTRADA: Object data        objeto que contiene la información estraída del servidor 
//VALOR DE RETORNO:      ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function monModulos(data){
	if(data.estatus>0){
		$("#lisModulos").remove();
		var cadena='<div class="list-group" id="lisModulos"></div>';
		$(cadena).appendTo("#panModulos");
		var modulos=data.modulos;
	 	cadena="";
		for (var i=0; i<modulos.length;i++){
				cadena+='<a  id="mod'+modulos[i].codigo +'" href="#" value="'+modulos[i].codigo+'" class="list-group-item  moduloElementos">';
				cadena+='<div class="row"><div class="col-lg-2">'+modulos[i].codigo+'</div>';
	  			cadena+='<div class="col-lg-8">'+modulos[i].nombre+'</div>';
	  			cadena+='<div class="col-lg-1">';
	  			if(Permisos.ModuloModificar)
	  				cadena+='<i id="modModulo'+modulos[i].codigo+'" onclick=\'forModulo("m",'+modulos[i].codigo+')\' title="Modificar módulo" class="icon-pencil icoModulos iconoModificar" ></i>';
	  			cadena+='</div>';
	  			cadena+='<div class="col-lg-1">';
	  			if(Permisos.ModuloEliminar)
	  				cadena+='<i id="eliModulo'+modulos[i].codigo+'" onclick=\'admModulo("e",'+modulos[i].codigo+')\' title="Eliminar módulo" class="icon-remove icoModulos iconoEliminar"></i>';
	  			cadena+='</div>';						
				cadena+='</div></a>';
		}

		$(cadena).appendTo("#lisModulos");
		ocuIcoModulos();
		hovModulos();
		cliModulos();
		idCliModulo="";
	}else
		mostrarMensaje(data.mensaje,2);
}
//---------------------------------INFORMACIÓN MODULO---------------------------------------------------------------------------------
//DESCRIPCIÓN:  Función que permite crear la estructura del modal de la administración de módulos. se puede apreciar el
//				input del buscador de módulos el panel de la lista y el div para la parte de modificación y agregación.
//PARÁMETROS DE ENTRADA: Ninguno.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function infModulo(){
	
	
	cadena='<div class="container">';

		cadena+='<div class="row"> <div class=col-md-4 >    <div class="input-group">';
	 	cadena+='<span class="input-group-addon" title="buscador de módulos"><i class="icon-search"></i></span>';
	  	cadena+='<input type="text" oninput="filModulos(sucFilModulos)" class="form-control 1" placeholder="Buscador de módulos" id="patModulo"></div></div>';
	  	cadena+='<div class="col-lg-7"> </div> <div class="col-lg-1"><center> <a href="otros/manuales/usuario/index.html#modulo" target="_blank"> <i  title="Ayuda"class="glyphicon glyphicon-question-sign iconoAyuda"></i> </a><center> </div></div><br>';
		


		cadena+="<div class='row'>";

			cadena+="<div class='col-md-5'>";
				cadena+="<div class='row'>";
/////////////Encabezado1//////////////////////////////////
		cadena+='<div id="panModulos" class="panel panel-default" >';
			cadena+='<div class="panel-heading">';
				cadena+='<div class="row">';
					cadena+='<h4 class="titBold"><center> Lista de módulos &nbsp;';
						if(Permisos.ModuloAgregar)
							cadena+='<a title="Agregar módulo" href="javascript:forModulo();"><i class="icon-plus-sign iconoAgregar" ></i></a>';
					cadena+='</center> </h4> ';
				cadena+='</div>';
			cadena+='</div>';
//////////////////////Encabezado2//////////////////////////
	  	cadena+='<div class="list-group">';
  			cadena+='<a href="#" class="list-group-item active">';
  			cadena+='<div class="row"> <div class="col-lg-2 ">#id</div>';
  			cadena+='<div class="col-lg-10"> Nombre</div>';
  			cadena+='</div></a>';				
  		cadena+='</div>';			

///////////////////////////módulos/////////////////////////////
		cadena+='<div class="list-group" id="lisModulos">';
		

		cadena+='</div>';
		cadena+='</div>';
//////////////////////////////////////////////////////////////7
	
	cadena+="</div>";


	cadena+="</div>";
	cadena+="<div class='col-md-1 tamano'></div>";
	cadena+="<div class='col-md-6'>";
				cadena+="<div class='row' id ='agrModModulo'></div></div>";
	cadena+="</div>";

	cadena+="</div>";
	

}
//---------------------------------HOVER MODULO---------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite colocar visible los icones de modificar y eliminar módulo cuando se le pasa el 
//				ratón sobre el módulo y ocultarlos cuando no.
//PARÁMETROS DE ENTRADA: Ninguno.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function hovModulos(){
	$(".moduloElementos").hover(
				function() {
					if(Permisos.ModuloModificar)
						$( "#modModulo"+$( this).attr( "value" )).show();
					if(Permisos.ModuloEliminar)
						$( "#eliModulo"+$( this).attr( "value" )).show();

					
				},
				function() {
					if (idCliModulo!=$( this).attr("value")) {
						$( "#modModulo"+$( this).attr( "value" )).hide();
						$( "#eliModulo"+$( this).attr( "value" )).hide();
					}
				}
	);
}
//-----------------------------------OCULTAR ICONOS MÓDULOS-------------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite ocultar los iconos de modificar y eliminar de todos los módulos.
//PARÁMETROS DE ENTRADA: Ninguno.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function ocuIcoModulos(){
	$(".icoModulos").hide();
}
//-----------------------------------CLICK MÓDULOS-------------------------------------------------------------------------------------
//DESCRIPCIÓN: Función que permite colocar visible los icones de modificar y eliminar módulo cuando se le da click
// 				sobre el módulo.
//PARÁMETROS DE ENTRADA: Ninguno.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function cliModulos(){
	$( ".moduloElementos" ).click(
				function() {
					ocuIcoModulos();
					idCliModulo=$( this).attr("value");
					if(Permisos.ModuloModificar)
						$( "#modModulo"+$( this).attr("value")).show();
					if(Permisos.ModuloEliminar)
						$( "#eliModulo"+$( this).attr( "value" )).show();
					
				}
	);
}
//-----------------------------------FORMULARIO MÓDULOS-------------------------------------------------------------------------------------
//DESCRIPCIÓN:función que permite crear el formulario con todos los campos(código,nombre y descripción) de  módulo 
//y si la acción es modificar llamará a obtModulo.
//PARÁMETROS DE ENTRADA: Char    accion     Cadena que representa la acción a realizar (agregar o modificar).
//						 Integer codigo     Código del módulo si es modificar.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function forModulo(accion="a",codigo=null){
	$("#forModulo").remove();
	var cadena='<div  class="panel panel-info" id="forModulo" >';
	////////////////////////////////////////////7
	cadena+='<div class="panel-heading">';
		cadena+='<div class="row">';
			if (accion=="a")
				cadena+='<center> <h5 class="titBold">Agregar módulo</h5> </center> ';
			if (accion=="m")
				cadena+='<center><h5 class="titBold"> modificar módulo </h5> </center>';
		cadena+='</div>';
	cadena+='</div>';
/////////////////////////////////////////////////////////
	cadena+= "<div class='list-group-item'>";

		cadena+="<div class='row'>";
		cadena+='<div class=col-md-6><div class="input-group">';
	 	cadena+='<span class="input-group-addon" title="Código"><i class="icon-qrcode"></i></span>';
	  	cadena+='<input type="text" disabled class="form-control 1" placeholder="Código" id="codModulo"></div> </div>';
		cadena+='<input type="hidden"  id="nomModHidden">';
		cadena+='<input type="hidden"  id="desModHidden">';

		cadena+='<div class=col-md-6><div class="input-group">';
	 	cadena+='<span class="input-group-addon" title="Nombre"><i >Nombre</i></span>';
	  	cadena+='<input type="text" oninput="actBotModulo()" onkeyup=\'validarSoloTexto("#nomModulo",1,30,true)\' class="form-control 1" placeholder="Nombre" id="nomModulo"></div> </div>';
		
		cadena+="<div class='row'>";
			cadena+="<div class='col-md-3'></div><br>";
			cadena+='<div class="col-md-6">Descripción <textarea oninput="actBotModulo()" onkeyup=\'validarRangos("#desModulo",1,100, false)\' class="form-control" rows="2" id="desModulo" title="Descripción" id="descripcion"></textarea></div>';
			cadena+="<div class='col-md-3'></div>";
		cadena+="</div><br>";
		cadena+="<div class='row'> ";
		cadena+="<center><button type='button' disabled id='botModulo' class='btn btn-success' title='Guardar' onclick=\"admModulo('"+accion+"',"+codigo+")\">Guardar</button></center>";
  		
		cadena+="</div>";

	
	cadena+="</div>";
/////////////////////////////////////
	cadena+="</div>";
		
	$(cadena).appendTo("#agrModModulo");
	if (accion=="m")
		obtModulo(preModModulo,codigo);

}
//-----------------------------------ACTIVAR BOTÓN MÓDULOS--------------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite  activar el botón de guardar módulo cuando se haya cambiado algún valor de los campos.
//PARÁMETROS DE ENTRADA: ninguno.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function actBotModulo(){
 	if ($("#nomModulo").val()!= $("#nomModHidden").val() || $("#desModulo").val()!= $("#desModHidden").val() )
 		$("#botModulo").attr("disabled",false);
 	else 
 		$("#botModulo").attr("disabled",true);

} 
//-----------------------------------SUCCESS FILTRAR MÓDULOS--------------------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite recibir la respuesta del servidor cuando la acción es filtrar los módulos
//				y deducirá si fue exitosa o no.
//PARÁMETROS DE ENTRADA: Object   data   Objeto que contiene la respuesta del servidor.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function sucFilModulos(data){
	if (data.estatus>0){
		monModulos(data);
	}
	else {
		mostrarMensaje(data.mensaje,2);
		$("#lisModulos").remove();
		var cadena='<div class="list-group" id="lisModulos"><center><h4>No se encontraron módulos</h4></center></div>';
		$(cadena).appendTo("#panModulos");
	}

}

//-----------------------------------ADMINISTRAR MODULO--------------------------------------------------------------------------------------
//DESCRIPCIÓN:  Función que permite administrar las acciones(agregar,modificar y eliminar) de los módulos
//				realiza las respectivas validaciones para agregar y modificar.
//PARÁMETROS DE ENTRADA: Char    accion   Cadena que representa la acción a ejecutar(agregar, modificar o eliminar).
//                       Integer codigo   Entero que representa el código del módulo cuando la acción es eliminar.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function admModulo(accion="a",codigo){


	if (accion=="e"){

	if (confirm ("Está seguro que desea eliminar el módulo"))
			eliModulo(sucEliModulo,codigo);
    
	}else

	if (validarSoloTexto("#nomModulo",1,30,true)   && validarRangos("#desModulo",1,100, false)){
		if (accion=="a" && $("#codModulo").val()=="" )
			agrModulo(sucAgrModulo);
		if (accion=="m"){
			modModulo(sucModModulo);
		}
		if (accion=="a" && $("#codModulo").val()!=""){
			modModulo(sucModModulo);
		}
	}



}
//-----------------------------------SUCCESS ELIMINAR MODULO--------------------------------------------------------------------------------------
//DESCRIPCIÓN: Función que permite recibir la respuesta del servidor cuando la acción es eliminar un módulo
//			   y deducirá si fue exitosa o no. Si es exitosa llamará a la función filModulos y listará los módulos con los
//			   nuevos cambios, sino enviará un mensaje de error.
//PARÁMETROS DE ENTRADA: Object  data   objeto que contiene la respuesta del servidor.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function sucEliModulo(data){
	if(data.estatus>0){
		mostrarMensaje("Módulo eliminado",1);
		$("#patModulo").val("");
		filModulos(sucFilModulos);
		$("#forModulo").remove();
		filModulos(lleSelModulos,"");
		$('#modulo').selectpicker('val',$("#modAccHidden").val());

	}
	else 
		mostrarMensaje(data.mensaje,2);

}
//-----------------------------------SUCCESS MODIFICAR MODULO--------------------------------------------------------------------------------------
//DESCRIPCIÓN:  Función que permite recibir la respuesta del servidor cuando la acción es modificar un módulo
//				y deducirá si fue exitosa o no. Si es exitosa llamará a la función filModulos y listará los módulos con los
//              nuevos cambios, sino enviará un mensaje de error.
//PARÁMETROS DE ENTRADA: Object  data objeto que contiene la respuesta del servidor.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function sucModModulo(data){

	if(data.estatus>0){
		mostrarMensaje(data.mensaje,1);
		$("#patModulo").val(data.codigo);
		filModulos(sucFilModulos);
		bloBotModulo();
		filModulos(lleSelModulos,"");
	}

	else 
		mostrarMensaje(data.mensaje,2);
}
//-----------------------------------PRE MODIFICAR MODULO--------------------------------------------------------------------------
//DESCRIPCIÓN: Función que permite recibir la respuesta del servidor cuando la acción es obtener un módulo
//			   y deducirá si fue exitosa o no. Si es exitosa colocará los valores extraídos por el servidor en los 
//             campos correspondientes, sino enviará un mensaje de error.
//PARÁMETROS DE ENTRADA: Object   data   Objeto que contiene la respuesta del servidor.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function preModModulo(data){
	if (data.estatus>0){

		var modulo=data.modulo;

		$("#codModulo").val(modulo[0].codigo);
		
		$("#nomModulo").val(modulo[0].nombre);
		$("#desModulo").val(modulo[0].descripcion);
		$("#nomModHidden").val(modulo[0].nombre);
		$("#desModHidden").val(modulo[0].descripcion);
	}
	else 
		mostrarMensaje(data.mensaje,2);

}
//-----------------------------------BLOQUEAR BOTÓN MODULO--------------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite bloquear el botón de guardar módulo y colocar los nuevos valores en los input 
//				hiddden que nos ayudan a comparar algún cambio en los input para activar o no el botón.
//PARÁMETROS DE ENTRADA: ninguno.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function bloBotModulo(){
	$("#botModulo").attr("disabled",true);
	$("#nomModHidden").val($("#nomModulo").val());
	$("#desModHidden").val($("#desModulo").val());
		
}

//-----------------------------------SUCCESS AGREGAR MODULO--------------------------------------------------------------------------
//DESCRIPCIÓN: Función que permite recibir la respuesta del servidor cuando la acción es agregar un módulo
//			   y deducirá si fue exitosa o no. Si es exitosa llamará a la función filModulos y listará los módulos con los
//			   nuevos cambios, sino enviará un mensaje de error.
//PARÁMETROS DE ENTRADA: Object  data  Objeto que contiene la respuesta del servidor.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------
function sucAgrModulo(data){
	if (data.estatus>0){
		mostrarMensaje(data.mensaje,1);
		$("#codModulo").val(data.codModulo);
		$("#patModulo").val(data.codModulo);
		filModulos(sucFilModulos);
		$("#agrModModulo  .titBold").html("Modificar módulo");
		bloBotModulo();
		filModulos(lleSelModulos,"");	
	}

	else 
		mostrarMensaje(data.mensaje,2);


}
//-----------------------------------LLENAR SELECT MÓDULOS--------------------------------------------------------------------------
//DESCRIPCIÓN:  Función que permite recibir la respuesta del servidor cuando la acción es filtar módulos
//				y deducirá si fue exitosa o no. Si fue exitosa creará un select y cargará los módulos en él.
//PARÁMETROS DE ENTRADA: Object  data  objeto que contiene la respuesta del servidor.
//VALOR DE RETORNO:      Ninguno.
//---------------------------------------------------------------------------------------------------------------------------------

function lleSelModulos(data){

	if (data.estatus>0){
		var modulo= $("#modulo").val();
		$("#SelModAccion").remove();

		var modulos=data.modulos;
		cadena="<div id='SelModAccion'>";
		cadena+="<select onchange='comCambios()' class='selectpicker' id='modulo' data-live-search='true' data-size='auto'";
		cadena+="multiple data-max-options='1'  data-style='btn-primary' title='Módulos' >";
		for (var i=0; i< modulos.length;i++)
			cadena+="<option value='"+ modulos[i].codigo+"'  id='opc"+modulos[i].codigo+"'>"+modulos[i].nombre+"</option>";
		cadena+="</select>";
		cadena+="</div>";
		$(cadena).appendTo("#selModulo");
		activarSelect();
		$('#modulo').selectpicker('val',modulo[0]);
	}
	else 
		mostrarMensaje(data.mensaje,2);

}


//*****TABLA****TABLA*****TABLA*******TABLA*************TABLA***********TABLA**************TABLA*******TABLA***********
//*****TABLA*******TABLA******TABLA**********TABLA***TABLA******TABLA******TABLA*****TABLA*********TABLA****TABLA******
//********TABLA**TABLA****TABLA***********TABLA**************TABLA********TABLA**TABLA**************TABLA******TABLA***

var idClick="";// ID que posee el click que ha dado el usuario. 


//----------------------------ARRASTRAR TABLAS--------------------------------------------------
//DESCRIPCIÓN: 	Función que permite, cargar la propiedad .sortable a clase .tablasP , esto 
//				permitirá que se puedan arrastrar elementos de una tabla a otra y dependiendo
//				de que lista venga la tabla se ejercerá la acción correspondiente ya que si 
//				una tabla viene "listaTablasNoAgregadas" a "listaTablasAgregadas" esta tabla
//				que se esta pasando se debe agregar a la base de datos y de ser al contrario 
//				se elimina la tabla.
//PARAMETROS DE ENTRADA: No posee.    
//VALOR DE RETORNO: 	 No posee. 	
//-----------------------------------------------------------------------------------------------
function arrTablas(){
    $(".tablasP").sortable({
    connectWith: '.tablasP',
    opacity: 1.0,
    tolerance: 'pointer',
    placeholder: 'place_holder_element',
                helper: function(event, el) {
                    var myclone = el.clone();
                    $("#modalTabla .modal-body").append(myclone);
                    return myclone;
                },
                receive: function( event, ui ) {
					var list=$(this).sortable().attr("id");
                    var elemento=ui.item.attr("id");
                    if (list=="listaTablasAgregadas"){
                        agreTabla($("#nom"+elemento).text(),elemento,true,sucAgreTabla);
                        
                    }else{
                    	
                        eliTabla(elemento,$("#nom"+elemento).text(),true,sucEliTabAgregadas);
                    }
                },
                stop:	function( event, ui ) {
                	
                }
            }).disableSelection();   
}
//----------------------------SUCCESS AGREGAR TABLA-------------------------------------------------------
//DESCRIPCIÓN: 	Función success de agregar tabla, esta función comprueba si la tabla se agrego correctamente
//				y muestra un mensaje con la información de lo ocurrido, de ser exitoso agrega la nueva tabla 
//				que se inserto a la base de datos a la lista de tablas agregadas("listaTablasAgregadas") y le activa
//				los efectos correspondientes y actualiza la lista de tablas.
//
//PARAMETROS DE ENTRADA: Object Data        Información que proviene del servidor, es la respuesta de el servidor.    
//VALOR DE RETORNO: 	 No posee. 	
//---------------------------------------------------------------------------------------------------------
function sucAgreTabla(data){
  if (data.estatus>0){
    tabla=data.tabla;
    mostrarMensaje("Tabla "+tabla[0]['nombre']+" agregada",1);
 	$(".sra").remove();
    $(armTabAgregada(tabla[0]["codigo"],tabla[0]["nombre"])).appendTo("#listaTablasAgregadas");
    escIcoTabla("#i"+tabla[0]["codigo"]);
    actEliTabla("#i"+tabla[0]["codigo"]);
    cliTablas();
    hovTablas();
    if($("#codigo").val()!="")
        infAccTabla($("#codigo").val(),"patTabAccion");
    else
        infAccTabla(null,"patTabAccion");
  }
  else{
    mostrarMensaje(data.mensaje,2);
    busTabPerCatalogo($("#filtarTablas").val(),sucBusTabPerCatalogo,"T");
   }
}
//----------------------------SUCCESS ELIMINAR TABLA-------------------------------------------------------
//DESCRIPCIÓN: 	Función success de eliminar tabla, esta función comprueba si la tabla se elimino correctamente
//				y muestra un mensaje con la información de lo ocurrido, de ser exitoso agrega la tabla 
//				que se elimino de la base de datos a la lista de tablas no agregadas ("listaTablasNoAgregadas") y le activa
//				los efectos correspondientes y actualiza la lista de tablas.
//
//PARAMETROS DE ENTRADA: Object Data        Información que proviene del servidor, es la respuesta de el servidor.    
//VALOR DE RETORNO: 	 No posee. 	
//---------------------------------------------------------------------------------------------------------
function sucEliTabAgregadas(data){

    if (data.estatus>0){
        mostrarMensaje(data.mensaje,1);
        $("#"+data.codigo).remove();
        $(".srn").remove();
        if (data.tabla!=null){
            $(armTabNoAgregada(data.codigo,data.tabla[0]["nombre"])).appendTo("#listaTablasNoAgregadas");
            actCarTabla("#ic"+data.codigo);
        	escIcoTabla();
        	cliTablas();
        	hovTablas();
        	delete tabValores["T"+data.codigo];
        	if($("#codigo").val()!="")
        		infAccTabla($("#codigo").val(),"patTabAccion");
        	else
        		infAccTabla(null,"patTabAccion");
        }
    }else{
        mostrarMensaje(data.mensaje,2);
        busTabPerCatalogo($("#filtarTablas").val(),sucBusTabPerCatalogo,"T");
    }

}
//----------------------------SUCCESS MODIFICAR TABLA----------------------------------------------------------------------
//DESCRIPCIÓN: 	Función success de modificar tabla, esta función comprueba si la tabla se modifico correctamente
//				y muestra un mensaje con la información de lo ocurrido, de ser exitoso actualiza las tablas.
//
//PARAMETROS DE ENTRADA: Object Data        Información que proviene del servidor, es la respuesta de el servidor.    
//VALOR DE RETORNO: 	 No posee. 	
//-------------------------------------------------------------------------------------------------------------------------
function sucModTabla(data){
    if (data.estatus>0){
        mostrarMensaje(data.mensaje,1);
        sucBusTabPerCatalogo(data);
        if($("#codigo").val()!="")
        	infAccTabla($("#codigo").val(),"patTabAccion");
   		else
        	infAccTabla(null,"patTabAccion");
    }else
        mostrarMensaje(data.mensaje,2);
}

//----------------------------CONFIGURAR PATRON BUSCAR TABLA Y FILTRAR TABLA----------------------------------------------
//DESCRIPCIÓN: 	Función que permite configurar el select de buscarTabla dependiendo de la búsqueda que se quiere realizar
//              cambia el color y configura a que función se llamara para filtrar.
//              
//PARAMETROS DE ENTRADA: No posee  
//VALOR DE RETORNO: 	 No posee. 	
//-------------------------------------------------------------------------------------------------------------------------
function conYFilTablas(){
tipoB=$("#selectBuscar").val();
     if (tipoB=="A"){
        $("[data-id='selectBuscar']").css("background-color", "#428BCA");
    }else if (tipoB=="N"){
        $("[data-id='selectBuscar']").css("background-color", "#F25B6A");

    }else if (tipoB=="I"){
        $("[data-id='selectBuscar']").css("background-color", "#DBEB2E");

    }else 
        $("[data-id='selectBuscar']").css("background-color", "#90EE90");
        if(tipoB!="T"){
             busTabPerCatalogo("",sucBusTabPerCatalogo,"T");
        }
        filTablas();
}

//----------------------------FILTRAR TABLAS------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite que dependiendo del tipo de búsqueda que quiere realizar el usuario
//              con lo que tenga seleccionado en el select de búsqueda de tablas, buscar la lista de tablas 
//              filtrada con lo que desea el usuario buscar.              
//PARAMETROS DE ENTRADA: No posee  
//VALOR DE RETORNO: 	 No posee. 	
//-------------------------------------------------------------------------------------------------------------
function filTablas(){
    tipoB=$("#selectBuscar").val();
    if (tipoB=="A"){
        $("[data-id='selectBuscar']").css("background-color", "#428BCA");
        busTabPerCatalogo($("#filtarTablas").val(),sucFilAgregadas,"A");
    }else if (tipoB=="N"){
        busTabPerCatalogo($("#filtarTablas").val(),sucFilNoAgregadas,"N");
    }else if (tipoB=="I"){
        busTabPerCatalogo($("#filtarTablas").val(),sucFilIndefinidas,"I");
    }else {
        busTabPerCatalogo($("#filtarTablas").val(),sucBusTabPerCatalogo,"T");
        
    }
}
//----------------------------DESACTIVAR O ACTIVAR BOTON DE MODIFICAR------------------------------------------
//DESCRIPCIÓN: 	Función que permite activar o desactivar el botón de modificar tabla dependiendo de los cambios que
//              que realicen a la tabla, ya que si los datos son iguales a los antiguos desactiva el botón y de ser 
//              diferentes lo activa.              
//PARAMETROS DE ENTRADA: No posee  
//VALOR DE RETORNO: 	 No posee. 	
//-------------------------------------------------------------------------------------------------------------
function DesActBoton(){
  if ($("#nombreTablaHidden").val()==$("#nombreTabla").val()){
         $("#botonModificar").attr("disabled",true);

    }else
        $("#botonModificar").attr("disabled",false);

}
//----------------------------DESAPARECE PANTALLA DE MODIFICAR TABLA------------------------------------------
//DESCRIPCIÓN: 	Función que permite remover de la vista todos los campos de modificar una tabla.              
//PARAMETROS DE ENTRADA: No posee  
//VALOR DE RETORNO: 	 No posee. 	
//-------------------------------------------------------------------------------------------------------------
function desAgrModTabla(){
$( "#admTablas" ).hide("fold", 400);
$("#imputsTabla").remove();
$( "#icoDesaparecerTabla" ).hide();
$( "#icoAgrTabla" ).show();
}

//----------------------------CREAR ELEMENTOS MODIFICAR TABLA------------------------------------------
//DESCRIPCIÓN: 	Funcion que permite aparecer los elementos para modificar una tabla, con la tabla a modificar cargada              
//PARAMETROS DE ENTRADA: Integer  codigo  Codigo de la tabla a modificar
//						 String   nombre  Nombre de la tabla a modificar  
//						 Boolean  tipo    Tipo de tabla a modificar.  
//VALOR DE RETORNO: 	 No posee. 	
//-------------------------------------------------------------------------------------------------------------
function agrModTabla(codigo,nombre,tipo=true){
$( "#icoAgrTabla" ).hide();
$("#imputsTabla").remove();
contenido="<div  id='imputsTabla'>";

contenido+="<div class='row'> <div class='col-lg-12'> <center><h4>Modificar Tabla </h4></center></div></div><hr>";
contenido+="<div class='row'> ";
contenido+="<div class='col-lg-1'></div>";
contenido+="<div class='col-lg-4'>";
contenido+="<div class='input-group'>";
contenido+="<span class='input-group-addon' title='código'>Codigo";
contenido+="</span>";
contenido+="<input  type='text' disabled class='form-control 1' value='"+codigo+"' placeholder='Código' id='codTablaDisable'>";
contenido+="</div>";
contenido+="</div>";
contenido+="</div>";
contenido+="<br>";
contenido+="<div class='row'> ";
contenido+="<div class='col-lg-1'></div>";
contenido+="<div class='col-lg-8'>";
contenido+="<div class='input-group'>";
contenido+="<span class='input-group-addon' title='Nombre tabla'><i class='icon-list'></i>";
contenido+="</span>";
contenido+="<input  oninput='DesActBoton()' id='nombreTabla' type='text' class='form-control 1' value='"+nombre+"' placeholder='Nombre de tabla' >";
contenido+="<input  oninput='DesActBoton()' id='nombreTablaHidden' type='hidden' class='form-control 1' value='"+nombre+"' placeholder='Nombre de tabla' >";
contenido+="</div>";
contenido+="</div>";

contenido+="<div class='col-lg-3'>";
contenido+="<div class='btn-group' role='group' aria-label='...''>";
contenido+=' <button onclick=\'modTabla(sucModTabla)\' id="botonModificar" disabled type="button" class="btn btn-primary">Guardar</i> </button>';
contenido+="</div>";
contenido+="</div>";

contenido+="</div>";
contenido+="<hr>";
contenido+="</div>";
$( "#admTablas" ).hide();
$(contenido).appendTo("#admTablas");
$( "#admTablas" ).show("fold", 400);
$( "#icoDesaparecerTabla" ).show();
}

//----------------------------SUCCESS FILTRAR TABLAS NO AGREGADAD------------------------------------------
//DESCRIPCIÓN: 	Función success que permite actualizar la lista de tablasNoAgregadas con las filtradas
//				por el usuario que se obtuvieron de base de datos y activarle sus efectos a las tablas.             
//PARAMETROS DE ENTRADA: Object Data       Respuesta del servidor con respecto a la petición que se realizo.  
//VALOR DE RETORNO: 	 No posee. 	
//-------------------------------------------------------------------------------------------------------------
function sucFilNoAgregadas(data){
    if(data.estatus>0){
         $("#listaTablasNoAgregadas").remove();
         tablas=data.tablas;
         conTablas="";
         if (tablas==null)
            conTablas=obtLisSinResultado("srn");
         else{
            for (var i=0; i<tablas.length; i++)
                conTablas+=armTabNoAgregada(i,tablas[i]["nombre"]);

            if (conTablas=="")
                conTablas=obtLisSinResultado("srn");
         }
        
        contenido="<div id ='listaTablasNoAgregadas' class='tablasP'>";
        contenido+=conTablas;
        contenido+="</div>";
        $(contenido).appendTo("#tablasNoAgregadas");
        actCarTabla(".iconoCargar");
        arrTablas();
        escIcoTabla();
        cliTablas();
        hovTablas();
    }else
        mostrarMensaje(data.mensaje,2);
}
//----------------------------SUCCESS FILTRAR TABLAS AGREGADAS------------------------------------------
//DESCRIPCIÓN: 	Función success que permite actualizar la lista de tablasAgregadas con las filtradas
//				por el usuario que se obtuvieron de base de datos y activarle sus efectos a las tablas.             
//PARAMETROS DE ENTRADA: Object Data       Respuesta del servidor con respecto a la petición que se realizo.  
//VALOR DE RETORNO: 	 No posee. 	
//-------------------------------------------------------------------------------------------------------------
function sucFilAgregadas(data){
    if (data.estatus>0){
        $("#listaTablasAgregadas").remove();
        tablas=data.tablas;
        conTablas="";
        if (tablas==null)
            conTablas=obtLisSinResultado("sra");
        else{
            for (var i=0; i<tablas.length; i++){
                  conTablas+=armTabAgregada(tablas[i]["codigo"],tablas[i]["nombre"]);
            }
            if (conTablas=="")
                conTablas=obtLisSinResultado("sra");
        }
         contenido="<div id ='listaTablasAgregadas' class='tablasP'>";
         contenido+=conTablas;
         contenido+="</div>";
         $(contenido).appendTo("#tablasAgregadas");
         actEliTabla(".iconoEliminarTabla");
         arrTablas();
         escIcoTabla();
        cliTablas();
        hovTablas();
    }else
        mostrarMensaje(data.mensaje,2);
}
//----------------------------SUCCESS FILTRAR TABLAS INDEFINIDAS------------------------------------------
//DESCRIPCIÓN: 	Función success que permite actualizar la lista de tablasNoExistentes con las filtradas
//				por el usuario que se obtuvieron de base de datos y activarle sus efectos a las tablas.             
//PARAMETROS DE ENTRADA: Object Data       Respuesta del servidor con respecto a la petición que se realizo.  
//VALOR DE RETORNO: 	 No posee. 	
//-------------------------------------------------------------------------------------------------------------
function sucFilIndefinidas(data){
    if (data.estatus>0){
        $("#listaTablasNoExistentes").remove();
        conTablas="";
        tablas=data.tablas;
        if (tablas==null)
            conTablas=obtLisSinResultado("sri");
        else{
            for (var i=0; i<tablas.length; i++){
                conTablas+=armTabNoIdentificada(tablas[i]["codigo"],tablas[i]["nombre"]);
            }

            if (conTablas==""){
                conTablas=obtLisSinResultado("sri");
            }
        }
        contenido="<div id ='listaTablasNoExistentes' class='tablasP'>";
        contenido+=conTablas;
        contenido+="</div>";
        $(contenido).appendTo("#tablasNoExistentes");
        actEliNI(".iconoEliminarNI");
        actModTabla(".iconoModificarTabla");
        escIcoTabla();
        cliTablas();
        hovTablas();

    }else
        mostrarMensaje(data.mensaje,2);

}
//----------------------------ARMAR TABLA AGREGADA------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite mediante el código y el nombre pasado por parámetro armar la estructura HTML que 
//              que posee una tabla cuando se encuentra agregada en base de datos.             
//PARAMETROS DE ENTRADA: Integer codigo       Código de la tabla que se desea armar.
//						 String  nombre       Nombre de la tabla que se desea armar.  
//VALOR DE RETORNO: 	 String               Estructura html de la tabla pasada por parámetro. 	
//-----------------------------------------------------------------------------------------------------------------
function armTabAgregada(codigo,nombre){
    var tablaA="";
    tablaA+="<a id='"+codigo+"'' href='#' class='list-group-item tablasElementos '>";
                tablaA+="<div class='row'>";
                    tablaA+="<div class='col-lg-3'>"+codigo+"</div>";
                    tablaA+="<div id='nom"+codigo+"'class='col-lg-7'>"+nombre+"</div>";
                    tablaA+="<div class='col-lg-1'><i id='i"+codigo+"' title='Eliminar tabla 'class='icon-remove iconosTabla iconoEliminar iconoEliminarTabla' ></i></div>";
                tablaA+="</div>";
    tablaA+="</a>";
    return tablaA;
}
//----------------------------ABRIR MODAL TABLAS------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite abrir y armar el modal de la administración de tablas .             
//PARAMETROS DE ENTRADA: Arreglo[][] tablas   Tablas para armar el modal con las tablas.
//VALOR DE RETORNO: 	No posee.	
//-----------------------------------------------------------------------------------------------------------------
function AbrModTablas(tablas){
	$("#modalTabla").remove();
	$(".modal").remove();
	crearDialogo("modalTabla","<center>Administración de tablas</center>",'',1000,"","",true);
	imputBuscar="<div id='buscar' class='row'><div class='col-lg-1'></div>";
	imputBuscar+="<div class='col-lg-4'><div class='input-group'><span class='input-group-addon' id='sizing-addon2'><i class='icon-search'></i></span><input id='filtarTablas' oninput='filTablas()' type='text' class='form-control' placeholder='Buscar tablas' aria-describedby='sizing-addon2'></div>";
	imputBuscar+="</div><div class='col-lg-4'> <select class='selectpicker ' id='selectBuscar' onChange='conYFilTablas()' data-size='auto'   title='Seleccione tabla a buscar'>";
	imputBuscar+="<option value='A'>Buscar agregadas</option>";
	imputBuscar+="<option value='N'>Buscar no agregadas</option>";
	imputBuscar+="<option value='I'>Buscar no existente en BD</option>";
	imputBuscar+="<option value='T'>Buscar todas</option>";
	imputBuscar+="</select>  </div> <div class='col-lg-3'><center> <a href='otros/manuales/usuario/index.html#tabla' target='_blank'> <i  title='Ayuda'class='glyphicon glyphicon-question-sign iconoAyuda'></i> </a><center> </div></div> <hr>";
	$("#modalTabla").modal("show");
	$(imputBuscar).appendTo("#modalTabla .modal-body");
	activarSelect("#selectBuscar");
	$("[data-id='selectBuscar']").css("background-color", "#428BCA");

	contenido="<div  id='admTablas' class='row'></div>";
	    contenido+="<div  id='listasTablas'>";
	contenido+="<div id='icoDesa' class='row'> <div class='col-lg-12'> <center><a title='Desaparecer edición' id= 'icoDesaparecerTabla' href='javascript:desAgrModTabla()'><i class='icon-chevron-up iconoDesaparecer' ></i></a></center></div></div>";
	contenido+="<div class='row'>";
	    contenido+="<div id ='tablasAgregadas' class='col-lg-4'>";
	        contenido+="<a href='#' class='list-group-item active titutoTablaAgregada'>";
	        contenido+="<div class='row'>";
	            contenido+="<div class='col-lg-12'><center>Tablas agregadas</center> </div>";
	        contenido+="</div>";
	        contenido+="</a>";
	        contenido+="</div>";
	contenido+="<div  id = 'tablasNoAgregadas' class='col-lg-4 '>";
	    contenido+="<a href='#' class='list-group-item  titutoNoAgregada'>";
	        contenido+="<div class='row'>";
	            contenido+="<div class='col-lg-12'><center>Tablas no agregadas</center> </div>";
	        contenido+="</div>";
	        contenido+="</a>";
	        contenido+="</div>";
	contenido+="<div id='tablasNoExistentes' class='col-lg-4'>";
	    contenido+="<a href='#' class='list-group-item  titutoTablaNoExistente'>";
	        contenido+="<div class='row'>";
	            contenido+="<div class='col-lg-12'><center>Tablas agregadas no existente en BD</center> </div>";
	        contenido+="</div>";
	        contenido+="</a>";
	        contenido+="</div>";
	contenido+="</div>";
	contenido+="</div>";
	$(contenido).appendTo("#modalTabla .modal-body");
	pie="<div class='row'> <div class='col-lg-10'>";
	pie+="<div class='row pieRow'><div class='col-lg-10'><h5 class='pieModal'> Para agregar una tabla presione el botón o arrástrela hasta tablas agregadas. Para eliminar una tabla presione el ícono de eliminar o arrástrela a tablas no agregadas</h5> </div> </div>";
	pie+="</div>";
	pie+="<div class='col-lg-2'> <div class='row'>";
	pie+="<div class='col-lg-12'><img src='recursos/imgPropias/fotos/mvc2.png'  height='70' width='70' class='img-circle'> </div>";
	pie+=" </div></div></div>";
	$(pie).appendTo("#modalTabla .modal-footer");

	$("#modalTabla .btn-danger").remove();
	$( "#icoDesaparecerTabla" ).hide();
	busTabPerCatalogo();
}

//----------------------------ARMAR TABLA SIN RESULTADO-------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite armar la estructura html cuando no hay resultado en la búsqueda de tabla.             
//PARAMETROS DE ENTRADA: String  clase       Clase que se quiere agregar a el html. 
//VALOR DE RETORNO: 	 String              Estructura html de la tabla sin resultado. 	
//-----------------------------------------------------------------------------------------------------------------
function obtLisSinResultado(clase){
	var sinResultado="";
        sinResultado+="<a href='#' class='list-group-item "+clase+" '>";
        	sinResultado+="<div class='row'>";
            sinResultado+="<div class='col-lg-3'></div>";
            sinResultado+="<div class='col-lg-7'>No hay resultados</div>";
        sinResultado+="</div></a>";
	return sinResultado;

}
//----------------------------ACTIVAR ELIMINAR TABLA NO IDENTIFICADA-------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite activarle a un elemento la función de eliminar tabla al darle click al elemento.             
//PARAMETROS DE ENTRADA: String  activador   id o clase del elemento que se desea cargarle la función. 
//VALOR DE RETORNO: 	 No posee. 	
//-----------------------------------------------------------------------------------------------------------------
function actEliNI(activador){
$( activador ).click(
                function() {
                    id=obtenerID($(this).attr("id"),1);
                    eliTabla(id,$("#nom"+id).text(),false,sucEliTabNoIdentificadas);
                }
    );
}
//----------------------------ACTIVAR MODIFICAR TABLA-------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite activarle a un elemento la función de modificar tabla al darle click al elemento.             
//PARAMETROS DE ENTRADA: String  activador   id o clase del elemento que se desea cargarle la función. 
//VALOR DE RETORNO: 	 No posee. 	
//-----------------------------------------------------------------------------------------------------------------
function actModTabla(activador){
$( activador ).click(
                function() {
                    id=obtenerID($(this).attr("id"),2);
                   agrModTabla(id,$("#nom"+id).text(),true);
                }

    );

}
//----------------------------ACTIVAR CARGAR TABLA-------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite activarle a un elemento la función de cargar tabla al darle click al elemento
//				es decir activa la función de agregar tabla.             
//PARAMETROS DE ENTRADA: String  activador   id o clase del elemento que se desea cargarle la función. 
//VALOR DE RETORNO: 	 No posee. 	
//-----------------------------------------------------------------------------------------------------------------
function actCarTabla(activador){
$( activador ).click(
                function() {
                    id=obtenerID($(this).attr("id"),2);
                   
                    agreTabla($("#nomn"+id).text(),'n'+id,tipo=true,sucAgreTabla)
                }
    );
}
//----------------------------ARMAR TABLA NO IDENTIFICADA------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite mediante el código y el nombre pasado por parámetro armar la estructura HTML que 
//              que posee una tabla cuando es no identificada es decir esta agregada pero no existe una tabla con ese 
//              nombre en la base de datos.             
//PARAMETROS DE ENTRADA: Integer codigo       Código de la tabla que se desea armar.
//						 String  nombre       Nombre de la tabla que se desea armar.  
//VALOR DE RETORNO: 	 String               Estructura html de la tabla pasada por parámetro. 	
//-----------------------------------------------------------------------------------------------------------------
function armTabNoIdentificada(codigo,nombre){
    var tablaNI="";
        tablaNI+="<a id='ni"+codigo+"' href='#' class='list-group-item tablasElementos '>";
                tablaNI+="<div class='row'>";
                   tablaNI+="<div class='col-lg-3'>"+codigo+"</div>";
                    tablaNI+="<div id='nom"+codigo+"' class='col-lg-6'>"+nombre+"</div>";
                    tablaNI+="<div class='col-lg-1'><i id='i"+codigo+"' title='Eliminar tabla 'class='icon-remove iconosTabla iconoEliminar iconoEliminarNI' ></i></div>";
                   tablaNI+="<div class='col-lg-1'><i id ='im"+codigo+"' title='Modificar tabla 'class='icon-pencil iconosTabla iconoModificar iconoModificarTabla' ></i></div>";
                tablaNI+="</div>";
            tablaNI+="</a>";
        return tablaNI;
}
//----------------------------ARMAR TABLA NO AGREGADAS------------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite mediante el código y el nombre pasado por parámetro armar la estructura HTML que 
//              que posee una tabla cuando no esta agregada en la abse de datos.             
//PARAMETROS DE ENTRADA: Integer codigo       Código de la tabla que se desea armar.
//						 String  nombre       Nombre de la tabla que se desea armar.  
//VALOR DE RETORNO: 	 String               Estructura html de la tabla pasada por parámetro. 	
//-----------------------------------------------------------------------------------------------------------------
function armTabNoAgregada(codigo,nombre){
    var tablaNA="";
    tablaNA+="<a id='n"+codigo+"'' href='#' class='list-group-item tablasElementos '>";
                tablaNA+="<div class='row'>";
                    tablaNA+="<div class='col-lg-1'></div>";
                    tablaNA+="<div id='nomn"+codigo+"' class='col-lg-8'>"+nombre+"</div>";
                    tablaNA+="<div class='col-lg-2'><i id='ic"+codigo+"'title='Cargar Tabla 'class='icon-arrow-up iconosTabla iconoCargar' ></i></div>";
                tablaNA+="</div>";
            tablaNA+="</a>";
    return tablaNA;
}
//----------------------------ESCONDER ICONO------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite esconder el icono que se pasa por parámetro             
//PARAMETROS DE ENTRADA: String  selector     id o clase de el icono que se desea esconder.
//VALOR DE RETORNO: 	 No posee
//-------------------------------------------------------------------------------------------------------
function escIcoTabla(selector='.iconosTabla'){

    $(selector).hide();
}
//----------------------------HOVER TABLAS ------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite activarle a la clase .tablasElementos la función de hover 
//              para aparecer los iconos cuando tenga hover el elemento y desaparecerlos cuando ya no 
//              tenga hover.             
//PARAMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//-------------------------------------------------------------------------------------------------------
function hovTablas(){
    $(".tablasElementos").hover(
                function() {

                    id= $(this).attr("id");

                    if(Permisos.TablaEliminar) {
                    	$("#i"+id).show();
                   	  $("#i"+obtenerID($( this).attr( "id" ),2)).show();
                   	}
                    if(Permisos.TablaAgregar)
                    	$("#ic"+obtenerID(id,1)).show();
                    if(Permisos.TablaModificar)
                    	$( "#im"+obtenerID($( this).attr( "id" ),2)).show();

                },
                function() {

                    id= $(this).attr("id");
                    if (idClickTabla!=$( this).attr("id")){
                    	
                        $("#i"+id).hide();
                        $("#i"+obtenerID($( this).attr( "id" ),2)).hide();
                    	$("#ic"+obtenerID(id,1)).hide();
                    	$("#im"+obtenerID($( this).attr( "id" ),2)).hide();
                    }
                }
    );
}
//----------------------------CLICK TABLAS-----------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite activarle a la clase .tablasElementos la función de click 
//              para aparecer que no se desvanezcan los iconos si esa tabla esta seleccionada
//				así como cambiar el color de fondo de la tabla. 
//              tenga hover.             
//PARAMETROS DE ENTRADA: No posee.
//VALOR DE RETORNO: 	 No posee.
//---------------------------------------------------------------------------------------------------
function cliTablas(){
    $( ".tablasElementos" ).click(
                function() {
                    escIcoTabla();
                    idClickTabla=$( this).attr("id");
                    $(".tablasElementos").css("background-color", "white");
                    $("#"+idClickTabla).css("background-color", "#C2BFB8");
                    id= $(this).attr("id");
                  if (Permisos.TablaEliminar)	{
                   	 $("#i"+obtenerID(id,2)).show();
                      $("#i"+id).show();
                   } 
                   if (Permisos.TablaModificar)
                   		$( "#im"+obtenerID($(this).attr( "id" ),2)).show();
                }
    );
}
//----------------------------SUCCCESS BUSCAR TABLAS PER Y CATALOGO-----------------------------------------------------------
//DESCRIPCIÓN: 	Función  de success que arma todas las tablas en la lista en la cual pertenece por ejemplos
//				las tablas agregadas, las no agregadas y las no identificadas todas por separado y las carga en
//				su lista correspondiente en la pantalla.             
//PARAMETROS DE ENTRADA: Object Data       Respuesta del servidor con respecto a la petición que se realizo.
//VALOR DE RETORNO: 	 No posee.
//-------------------------------------------------------------------------------------------------------------------------
function sucBusTabPerCatalogo(data){
    if (data.estatus>0){
        var tablasAgregadas="";
        var tablasNoAgregadas="";
        var tablasNoDefinida="";
        $("#listaTablasAgregadas").remove();
        $("#listaTablasNoAgregadas").remove();
        $("#listaTablasNoExistentes").remove();
        tablas=data.tablas;
        if (data.tablas==null){
             tablasAgregadas=obtLisSinResultado("sra");
             tablasNoAgregadas=obtLisSinResultado("srn");
             tablasNoDefinida=obtLisSinResultado("sri");

        }else{ 

            for (var i=0; i< tablas.length; i++){
                if (tablas[i]["estatus"]=="S"){
                    tablasAgregadas+=armTabAgregada(tablas[i]["codigo"],tablas[i]["nombre"])
                }
                if (tablas[i]["estatus"]=="N"){
                    tablasNoAgregadas+= armTabNoAgregada(i,tablas[i]["nombre"]);
                }
                if (tablas[i]["estatus"]=="I"){
                    tablasNoDefinida+=armTabNoIdentificada(tablas[i]["codigo"],tablas[i]["nombre"]);
                }
            }
            if (tablasAgregadas==""){
                tablasAgregadas=obtLisSinResultado("sra");
            }
            if (tablasNoAgregadas==""){
                tablasNoAgregadas=obtLisSinResultado("srn");
            }
            if (tablasNoDefinida==""){
                tablasNoDefinida=obtLisSinResultado("sri");
            }
        }
        contenidoAgregada="<div id ='listaTablasAgregadas' class='tablasP'>";
        contenidoAgregada+=tablasAgregadas;
        contenidoAgregada+="</div>";

        contenidoNoAgregada="<div id ='listaTablasNoAgregadas' class='tablasP'>";
        contenidoNoAgregada+=tablasNoAgregadas;
        contenidoNoAgregada+="</div>";

        contenidoIndefinido="<div id ='listaTablasNoExistentes'>";
        contenidoIndefinido+=tablasNoDefinida;
        contenidoIndefinido+="</div>";

        $(contenidoNoAgregada).appendTo("#tablasNoAgregadas");
        $(contenidoIndefinido).appendTo("#tablasNoExistentes");
        $(contenidoAgregada).appendTo("#tablasAgregadas");
        arrTablas();
        escIcoTabla();
        actCarTabla(".iconoCargar");
        actEliNI(".iconoEliminarNI");
        actEliTabla(".iconoEliminarTabla");
        actModTabla(".iconoModificarTabla");
        hovTablas();
        cliTablas();
    }else
        mostrarMensaje(data.mensaje,2);
    
}
//----------------------------ACTIVAR ELIMINAR TABLA-------------------------------------------------------------
//DESCRIPCIÓN: 	Función que permite activarle a un elemento de las tablas agregadas la función de eliminar tabla 
//              al darle click al elemento             
//PARAMETROS DE ENTRADA: String  activador   id o clase del elemento que se desea cargarle la función. 
//VALOR DE RETORNO: 	 No posee. 	
//-----------------------------------------------------------------------------------------------------------------
function actEliTabla(activador){
$( activador ).click(
                function() {
                    id=obtenerID($(this).attr("id"),1);
                        eliTabla(id,$("#nom"+id).text(),true,sucEliTabAgregadas);
                }
    );
}
//----------------------------SUCCESS DE ELIMINAR NO IDENTIFICADAS----------------------------------------------------
//DESCRIPCIÓN: 	Función success que permite mostrar un mensaje de lo ocurrido en el servidor al eliminar la tabla no
//				identificada.             
//PARAMETROS DE ENTRADA: Object Data       Respuesta del servidor con respecto a la petición que se realizo.
//VALOR DE RETORNO: 	 No posee.	
//-----------------------------------------------------------------------------------------------------------------
function sucEliTabNoIdentificadas(data){

    if (data.estatus>0){
        mostrarMensaje(data.mensaje,1);
        $("#ni"+data.codigo).remove();
    }else
        mostrarMensaje(data.mensaje,2);
}

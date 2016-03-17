



$(document).on("scroll", function(){
	var desplazamientoActual = $(document).scrollTop();
	console.log(desplazamientoActual);

	if (desplazamientoActual>394){
		$("#nav").css("background-color", "#b4d2ea"); 
		$(".colorTexto").css("color", "#354D57"); 
	}else{
		$("#nav").css("background-color", "transparent");
		 $(".colorTexto").css("color", "#2B718D"); 
	}



	if(desplazamientoActual>505 && desplazamientoActual<900){
		sinColorTodo();
		colorPosicion("listaContenido-introduccion");	
	}else if(desplazamientoActual>=900 && desplazamientoActual<1463){
		sinColorTodo();
		colorPosicion("listaContenido-requisito");
	}else if(desplazamientoActual>=1463 && desplazamientoActual<2138){
		sinColorTodo();
		colorPosicion("listaContenido-accion");
	}else if(desplazamientoActual>=2138 && desplazamientoActual<3994){
		sinColorTodo();
		colorPosicion("listaContenido-agregarAccion");
	}else if(desplazamientoActual>=3994 && desplazamientoActual<5963){
		sinColorTodo();
		colorPosicion("listaContenido-modificarAccion");
	}else if(desplazamientoActual>=5963 && desplazamientoActual<6413){
		sinColorTodo();
		colorPosicion("listaContenido-eliminarAccion");
	}else if(desplazamientoActual>=6413 && desplazamientoActual<7144){
		sinColorTodo();
		colorPosicion("listaContenido-tabla");
	}else if(desplazamientoActual>=7144 && desplazamientoActual<8100){
		sinColorTodo();
		colorPosicion("listaContenido-agregarTabla");
	}else if(desplazamientoActual>=8100 && desplazamientoActual<9198){
		sinColorTodo();
		colorPosicion("listaContenido-modificarTabla");
	}else if(desplazamientoActual>=9198 && desplazamientoActual<9816){
		sinColorTodo();
		colorPosicion("listaContenido-eliminarTabla");
	}else if(desplazamientoActual>=9816 && desplazamientoActual<10548){
		sinColorTodo();
		colorPosicion("listaContenido-modulo");
	}else if(desplazamientoActual>=10548 && desplazamientoActual<11223){
		sinColorTodo();
		colorPosicion("listaContenido-agregarModulo");
	}else if(desplazamientoActual>=11223 && desplazamientoActual<11954){
		sinColorTodo();
		colorPosicion("listaContenido-modificarModulo");
	}else if(desplazamientoActual>=11954 && desplazamientoActual<12685){
		sinColorTodo();
		colorPosicion("listaContenido-eliminarModulo");
	}else if(desplazamientoActual>=12685 && desplazamientoActual<13585){
		sinColorTodo();
		colorPosicion("listaContenido-usuario");
	}else if(desplazamientoActual>=13585 && desplazamientoActual<14598){
		sinColorTodo();
		colorPosicion("listaContenido-agregarUsuario");
	}else if(desplazamientoActual>=14598 && desplazamientoActual<15385){
		sinColorTodo();
		colorPosicion("listaContenido-modificarUsuario");
	}else if(desplazamientoActual>=15385 && desplazamientoActual<16060){
		sinColorTodo();
		colorPosicion("listaContenido-eliminarUsuario");
	}else if(desplazamientoActual>=16060 && desplazamientoActual<17466){
		sinColorTodo();
		colorPosicion("listaContenido-privilegios");
	}else if(desplazamientoActual>=17466 && desplazamientoActual<18222){
		sinColorTodo();
		colorPosicion("listaContenido-otorgarPrivilegio");
	}else if(desplazamientoActual>=18222 && desplazamientoActual<19065){
		sinColorTodo();
		colorPosicion("listaContenido-revocarPrivilegio");
	}else if(desplazamientoActual>=19065&& desplazamientoActual<20010){
		sinColorTodo();
		colorPosicion("listaContenido-clonarPrivilegios");
	}



	if((desplazamientoActual>450) &&(ancho>1193) ){

		$("#mvcRiveroProfile").css("position", "fixed"); 
		$("#mvcRiveroProfile").css("top", "140px"); 
		$("#mvcRiveroProfile").css("width", "16.66667%"); 
	}else{
		$("#mvcRiveroProfile").css("position", "relative"); 
		$("#mvcRiveroProfile").css("top", "30px"); 
		$("#mvcRiveroProfile").css("width", "100%");

	}

	if((desplazamientoActual>788)  &&(ancho>1193)){
		$("#contenidoDocumentacion").css("position", "fixed"); 
		$("#listaContenido").css("top", "100px"); 

	}else
		$("#contenidoDocumentacion").css("position", "relative"); 
		$("#contenidoDocumentacion").css("top", "10px"); 
		$("#listaContenido").css("top", "45px"); 

});

function colorPosicion(id){
	$("#"+id).css("padding-left", "18px"); 
	$("#"+id).css("color", "#3097d1"); 
	$("#"+id).css("background-color", "transparent"); 
	$("#"+id).css("border-left", "2px solid #3097d1"); 
	$("#"+id).css("display", "block"); 
	$("#"+id).css("padding", "2px 10px 2px 10px"); 
	$("#"+id).css("text-decoration", "none"); 

}
function sinColor(id){
	$("#"+id).css("padding-left", "20px"); 
	$("#"+id).css("color", "#536570"); 
	$("#"+id).css("display", "block"); 
	$("#"+id).css("padding", "2px 10px 2px 10px"); 
	$("#"+id).css("text-decoration", "none"); 
	$("#"+id).css("border-left", "0px solid #3097d1"); 
}


function sinColorTodo(){
		sinColor("listaContenido-introduccion");
		sinColor("listaContenido-requisito");
		sinColor("listaContenido-accion");
		sinColor("listaContenido-agregarAccion");
		sinColor("listaContenido-modificarAccion");
		sinColor("listaContenido-eliminarAccion");
		sinColor("listaContenido-tabla");
		sinColor("listaContenido-agregarTabla");
		sinColor("listaContenido-modificarTabla");
		sinColor("listaContenido-eliminarTabla");
		sinColor("listaContenido-modulo");
		sinColor("listaContenido-agregarModulo");
		sinColor("listaContenido-modificarModulo");
		sinColor("listaContenido-eliminarModulo");
		sinColor("listaContenido-usuario");
		sinColor("listaContenido-agregarUsuario");
		sinColor("listaContenido-modificarUsuario");
		sinColor("listaContenido-eliminarUsuario");
		sinColor("listaContenido-privilegios");
		sinColor("listaContenido-otorgarPrivilegio");
		sinColor("listaContenido-revocarPrivilegio");
		sinColor("listaContenido-clonarPrivilegios");
		sinColor("listaContenido-desarrolladores");

}



$( document ).ready(function() {

	$("#dAccionH").hover(
				function() {
					   $("#dAccion").click();
				},
				function() {
						 $("#dAccion").click();
				}
	);


	$("#dTablaH").hover(
				function() {
					   $("#dTabla").click();
				},
				function() {
						 $("#dTabla").click();
				}
	);
	$("#dModuloH").hover(
				function() {
					   $("#dModulo").click();
				},
				function() {
						 $("#dModulo").click();
				}
	);
	$("#dUsuarioH").hover(
				function() {
					   $("#dUsuario").click();
				},
				function() {
						 $("#dUsuario").click();
				}
	);
	$("#dPrivilegiosH").hover(
				function() {
					   $("#dPrivilegios").click();
				},
				function() {
						 $("#dPrivilegios").click();
				}
	);
});




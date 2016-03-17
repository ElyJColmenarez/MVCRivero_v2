
function validarSoloTexto(id, min, max, req = false){
	$(".popValidacion").hide();
	var cad = $(id).val();
	
	var val=/^[A-Za-z ÁÉÍÓÚáéíóúñÑ]{0,5000}$/;
	if(req){
		if(cad.length == 0){
			detonarAdvertencia(id,"Este campo es requerido.");
			return false;
		}
		else{
			if(!(validarMatch(cad,val))){				
				detonarAdvertencia(id, "El campo no es correcto. Sólo letras.");
				return false;
			}
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres");
				return false;
			}
		}
	}
	else{
		if(cad.length > 0){
			if(!(validarMatch(cad,val))){
				detonarAdvertencia(id, "El campo no es correcto. Sólo letras.");
				return false;
			}
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres");
				return false;
			}
		}
	}
	return true;
}


function validarSoloTextoYCaracteres(id, min, max, req = false){
	$(".popValidacion").hide();
	var cad = $(id).val();
	var val=/^[A-Za-z ÁÉÍÓÚáéí".óúñÑ]{0,5000}$/;
	if(req){
		if(cad.length == 0){
			detonarAdvertencia(id,"Este campo es requerido.");
			return false;
		}
		else{
			if(!(validarMatch(cad,val))){
				
				detonarAdvertencia(id, "El campo no es correcto. Sólo letras.");
				return false;
			}
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres");
				return false;
			}
		}
	}
	else{
		if(cad.length > 0){
			if(!(validarMatch(cad,val))){
				detonarAdvertencia(id, "El campo no es correcto. Sólo letras.");
				return false;
			}
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres");
				return false;
			}
		}
	}
	return true;
}


function validarSoloNumeros(id,min,max,req){
	$(".popValidacion").hide();
	var cad = $(id).val();
	var val = /^([0-9])*$/;

	if(req){
		if(cad.length == 0){
			detonarAdvertencia(id,"Este campo es requerido.");
			return false;
		}
		else{
			if(!(validarMatch(cad,val))){
				detonarAdvertencia(id, "El campo no es correcto. Sólo caracteres numéricos.");
				return false;
			}
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres.");
				return false;
			}
		}
	}
	else{
		if(cad.length > 0){
			if(!(validarMatch(cad,val))){
				detonarAdvertencia(id, "El campo no es correcto. Sólo caracteres numéricos.");
				return false;
			}
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres.");
				return false;
			}
		}
	}
	return true;
}

function validarFecha(id,req){
	$(".popValidacion").hide();
	var cad = $(id).val();
	
	
	
	
	var val = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
	
	
	
	if(req){
		if(cad.length == 0){
			detonarAdvertencia(id,"Este campo es requerido.");
			return false;	
		}
		else{
			if(!(validarMatch(cad,val))){
				detonarAdvertencia(id, "El campo no es correcto. Introduzca una fecha válida (XX/XX/XXXX).");
				return false;
			}
		}
	}
	else{
		if(cad.length > 0){
			if(!(validarMatch(cad,val))){
				detonarAdvertencia(id, "El campo no es correcto. Introduzca una fecha válida (XX/XX/XXXX).");
				return false;
			}
		}
	}
	$(id).popover();
	return true;
}

function validarEmail(id,min = 5 ,max = 30, req = false){
	$(".popValidacion").hide();
	var cad = $(id).val();
	var val = /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;

	if(req){
		if(cad.length == 0){
			detonarAdvertencia(id,"Este campo es requerido.");
			return false;
		}
		else{
			if(!(validarMatch(cad,val))){
				detonarAdvertencia(id, "El campo no es correcto. Introduzca un correo válido (ejemplo@ejemplo.ej).");
				return false;
			}
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres.");
				return false;
			}
		}
	}
	else{
		if(cad.length > 0){
			if(!(validarMatch(cad,val))){
				detonarAdvertencia(id, "El campo no es correcto. Introduzca un correo válido (ejemplo@ejemplo.ej)");
				return false;
			}
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres.");
				return false;
			}
		}
	}
	return true;
}

function validarTelefono(id, min, max, req){
	$(".popValidacion").hide();
	var cad = $(id).val();
	var val =  	/^[0-9]{3,4}-? ?[0-9]{7}$/;

	if(req){
		if(cad.length == 0){
			detonarAdvertencia(id,"Este campo es requerido.");
			return false;
		}
		else{
			if(!(validarMatch(cad,val))){
				detonarAdvertencia(id, "El campo no es correcto. Introduzca un teléfono válido (XXXX-XXXXXXX)).");
				return false;
			}
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres.");
				return false;
			}
		}
	}
	else{
		if(cad.length > 0){
			if(!(validarMatch(cad,val))){
				detonarAdvertencia(id, "El campo no es correcto. Introduzca un teléfono válido (XXXX-XXXXXXX)).");
				return false;
			}
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres.");
				return false;
			}
		}
	}
	return true;
}

function validarRangos(id, min, max, req){
	$(".popValidacion").hide();
	var cad = $(id).val();
	if(req){
		if(cad.length == 0){
			detonarAdvertencia(id,"Este campo es requerido.");
			return false;
		}
		else{
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres.");
				return false;
			}
		}
	}
	else{
		if(cad.length > 0){
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres.");
				return false;
			}
		}
	}
	return true;
}

function validarRango(cad, min, max){
	return ((cad.length > max)||(cad.length < min));
}

function validarMatch(cad, patron){
	var p = patron;
	return (cad.match(p));
}

function detonarAdvertencia(id,mensaje){
	$(id).popover('destroy');
	$(id).popover({title: 'Validación:', content: mensaje , placement : "top", template : '<div id="pop'+id+'" class="popover popValidacion" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'});
	$(id).trigger("click");
}

function requerido(id){
	$(".popValidacion").hide();
	var cad = $(id).val();
		if(cad.length == 0){
			detonarAdvertencia(id,"Este campo es requerido.");
			return false;
		}
	return true;
}
function valNoInput(ids,idd,mensaje){
	$(".popValidacion").hide();
	var cad = $(ids).val();
	if (cad==null){
		
		detonarAdvertencia(idd,mensaje);
		return false
	}	
	return true;
}

function valSwich(idd,mensaje,indicador){
	$(".popValidacion").hide();
	
	if (indicador==false){
		detonarAdvertencia(idd,mensaje);
		return false
	}	
	return true;
}
//comparar contraseña
function comContraseña(id1,id2){
	$(".popValidacion").hide();
	var cad1 = $(id1).val();
	var cad2 = $(id2).val();
	if (cad1==cad2){
		return true;
	}else 
		detonarAdvertencia(id2,"Las contraseña no coinciden");
		return false;
	}



function validarTextoNumeros(id, min, max, req = false){
	$(".popValidacion").hide();
	var cad = $(id).val();
	
	var val=/^[A-Za-z0-9 ÁÉÍÓÚáéíóúñÑ]{0,5000}$/;
	if(req){
		if(cad.length == 0){
			detonarAdvertencia(id,"Este campo es requerido.");
			return false;
		}
		else{
			if(!(validarMatch(cad,val))){				
				detonarAdvertencia(id, "El campo no es correcto. Sólo letras y números.");
				return false;
			}
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres");
				return false;
			}
		}
	}
	else{
		if(cad.length > 0){
			if(!(validarMatch(cad,val))){
				detonarAdvertencia(id, "El campo no es correcto. Sólo letras.");
				return false;
			}
			if(validarRango(cad,min,max)){
				detonarAdvertencia(id,"El campo debe tener entre "+min+"-"+max+" caracteres");
				return false;
			}
		}
	}
	return true;
}
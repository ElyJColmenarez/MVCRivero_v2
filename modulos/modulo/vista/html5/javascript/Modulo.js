//Modulo.js 
//Archivo en el cual contiene todas las llamadas al servidor de las acciones de módulo.
//Autores: Geraldine Castillo 
//		   Jhonny Vielma


//función que permite hacer una petición al servidor de agregar un módulo.
//Parámetros de entrada:funSucces: función que se ejecutará cuando traiga la información de la petición.
//valor de retorno: ninguno.
function agrModulo(funSucces) {
	
	var a=Array("m_modulo","modulo","m_accion","agregar","nombre",$("#nomModulo").val(),
		"descripcion",$("#desModulo").val()
			);
	ajaxMVC(a,funSucces,error);
}
//Función que permite obtener un módulo según su código a través de una petición al servidor.
//Parámetros de entrada: codigo: entero que representa el código del módulo.
//						funSucces: función que ejecutará una vez que llegue la respuesta de la petición al servidor.	

function obtModulo(funSucces,codigo) {
	
	var a=Array("m_modulo","modulo","m_accion","obtener","codigo",codigo
			);
	ajaxMVC(a,funSucces,error);
}
//Función que permite modificar un módulo a través de una petición al servidor.
//Parámetros de entrada: funSucces: función que se ejecutrá cuando regrese la petión del servidor.
//Valor de retorno: ninguno
function modModulo(funSucces) {
	
	var a=Array("m_modulo","modulo","m_accion","modificar","codigo",$("#codModulo").val(),"nombre",$("#nomModulo").val(),
		"descripcion",$("#desModulo").val()
			);
	ajaxMVC(a,funSucces,error);
}

//Función que permite eliminar un módulo a través de una petición al servidor.
//Parámetros de entrada: codigo: entero que representa el código del módulo a eliminar.
//Valor de retorno: Ninguno. 
function eliModulo(funSucces,codigo) {
	
	var a=Array("m_modulo","modulo","m_accion","eliminar","codigo",codigo
			);
	ajaxMVC(a,funSucces,error);
}
//Función que permite ir al servidor con la acción de filtrar y extraer los módulos a través de un patrón
//Parámetros de entrada:funSucces: función que se ejecutará una vez traído la respuesta del servidor.
//						patron: cadena que representa el patrón de búsqueda
//
function filModulos(funSucces,patron=null) {
	if (patron ==null){
	
		var a=Array("m_modulo","modulo","m_accion","filtrar","patron",$("#patModulo").val()
			);
	}else 
		var a=Array("m_modulo","modulo","m_accion","filtrar","patron",patron
			);
	ajaxMVC(a,funSucces,error);
}
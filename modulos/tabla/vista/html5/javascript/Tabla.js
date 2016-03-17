var idClickTabla=""; // Id de la tabla a la cual el usuario le dio click.

//-------------------------MODIFICAR TABLA------------------------------------------------
//DESCRIPCIÓN:  Función que permite lanzar una petición ajax al servidor que permite
//              modificar una tabla en la base de datos, el código de la tabla debe
//              estar guardado en el id="codTablaDisable" y el nombre en el id="nombreTabla"
//              la función le asignara como success al ajax la función pasado como sucModTabla.
//PARAMETROS DE ENTRADA: Function sucModTabla        Función de success que se le asignara a la petición ajax..
//VALOR DE RETORNO:      No posee.   
//-----------------------------------------------------------------------------------------
function modTabla(sucModTabla){
    codigo=$("#codTablaDisable").val();
    nombre=$("#nombreTabla").val();
  var a=Array("m_modulo","tabla","m_accion","modificar",
                "nombre",nombre,"codigo",codigo);
     ajaxMVC(a,sucModTabla,error);
}
//-------------------------AGREGAR TABLA------------------------------------------------
//DESCRIPCIÓN:  Función que permite lanzar una petición ajax al servidor que permite
//              agregar una tabla en la base de datos, la de los datos pasados por parámetro y
//              asignarle el success al ajax.
//PARAMETROS DE ENTRADA: String   nombre      Nombre de la tabla a agregar.
//                       String   codTmp      Código temporal de la tabla para eliminarla de la lista de tablas no agregadas.
//                       Function funSucc     Función de success que se le asignara a la petición ajax.
//VALOR DE RETORNO:      No posee.   
//-----------------------------------------------------------------------------------------
function agreTabla(nombre,codTmp,tipo=true,funSucc){
    if (Permisos.TablaAgregar){

        var a=Array("m_modulo","tabla","m_accion","agregar",
                "nombre",nombre);
        $("#"+codTmp).remove();
        if (tipo){
            ajaxMVC(a,funSucc,error);
         }
         else
            ajaxMVC(a,funSucc,error);
   } else
        busTabPerCatalogo($("#filtarTablas").val(),sucBusTabPerCatalogo,"T");
}
//-------------------------ELIMINAR TABLA------------------------------------------------
//DESCRIPCIÓN:  Función que permite lanzar una petición ajax al servidor que permite
//              eliminar una tabla en la base de datos, la del código pasado por parámetro
//              y asignarle el success al ajax.
//PARAMETROS DE ENTRADA: Integer  codigo    Código de la tabla a eliminar.
//                       String   nombre    Nombre de la tabla a eliminar.
//                       Boolean  tipo      Tipo de tabla, existente o no en bd.
//                       Function funSucc   Función de success que se le asignara a la petición ajax.
//VALOR DE RETORNO:      No posee.   
//-----------------------------------------------------------------------------------------
function eliTabla(codigo,nombre,tipo=true,funSucc){
    if (Permisos.TablaEliminar){
        if (confirm("Está seguro que desea eliminar la tabla "+nombre)){
            var a=Array("m_modulo","tabla","m_accion","eliminar",
                        "codigo",codigo,'nombre',nombre,
                        "tipo",tipo);
            if (tipo){
                ajaxMVC(a,funSucc,error);
            }
            else
                ajaxMVC(a,funSucc,error);
        }else
            
            busTabPerCatalogo($("#filtarTablas").val(),sucBusTabPerCatalogo,"T");
    }else
        busTabPerCatalogo($("#filtarTablas").val(),sucBusTabPerCatalogo,"T");
}

//-------------------------LISTAR TABLAS EN BD Y SCHEMAS ---------------------------------------------------------------
//DESCRIPCIÓN:  Función que permite lanzar una petición ajax al servidor que permite
//              obtener una lista de tablas de la base de datos, las que están agregadas en la tabla
//              como todas las que existen en la base de datos y se puede filtrar con el parámetro
//              tipoB que representa las tablas que se quieren obtener 'T'= todas las tablas, 'N'=
//              las tablas no agregadas, 'I'= las agregadas pero su nombre no coincide con ninguna
//              tabla de la base de datos y 'A'= que son las tablas agregadas que existen en la base de datos,
//              aparte de este filtro existe otro que es patrón el cual permite filtrar en las tablas que se obtuvieron
//              es decir permite filtrar en las tablas con tipoB= A o tipoB=I,etc y asignarle el success al ajax.
//PARAMETROS DE ENTRADA: String   patron     Patrón de filtro de las tablas.
//                       Function funSucc    Nombre de la tabla a eliminar.
//                       Char     tipoB      Tipo de tablas que se quieren obtener,'T'= todas las tablas, 'N'=
//                                           las tablas no agregadas, 'I'= las agregadas pero su nombre no coincide
//                                           con ninguna tabla de la base de datos y 'A'= que son las tablas agregadas
//                                           que existen en la base de datos .
//VALOR DE RETORNO:      No posee.   
//-----------------------------------------------------------------------------------------------------------------------
function busTabPerCatalogo(patron="",funSucc,tipoB="T"){

    var a=Array("m_modulo","tabla","m_accion","obtTabPerCatalogo",
                "patron",patron,"tipoB",tipoB);
    if (tipoB=="T")
        ajaxMVC(a,sucBusTabPerCatalogo,error);
    else 
        ajaxMVC(a,funSucc,error);
}

//-------------------------OBTENER ID------------------------------------------------
//DESCRIPCIÓN:  Función que permite obtener el id de una cadena pasada por parámetro,
//              esta función su utiliza cuando se tienen id compuestos por otros caracteres
//              por ejemplo: supongamos que tenemos el id tab2 y el verdadero id es el 2 
//              la función permite obtener el 2 de esa cadena ya que omitirá los caracteres
//              que se le indiquen.
//PARAMETROS DE ENTRADA: String cadena                   Cadena donde se encuentra el id.
//                       Integer canCaractenerOmitidos   Cantidad de caracteres que se quieren omitir.
//VALOR DE RETORNO:      String                          ID real.   
//-----------------------------------------------------------------------------------------

function obtenerID(cadena,canCaractenerOmitidos){
    var cadena1="";
    for (var i=canCaractenerOmitidos; i<cadena.length; i++){
        cadena1+=cadena[i];
    }
    return cadena1;

}
//-------------------------OBTENER TABLAS DE UNA ACCIÓN CON SU PERMISOLOGÍA------------------------------------------------
//DESCRIPCIÓN:  Función que permite lanzar una petición ajax al servidor que permite
//              obtener de una acción la lista de tablas relacionadas con esta y su permisología 
//              en las tablas y de igual forma obtiene las tablas con las cuales no tiene relación al 
//              igual que permite filtrar entre esta lista de tablas y asigna la funSucc a la petición ajax.
//PARAMETROS DE ENTRADA: Function  funSucc       Success de la petición ajax.
//                       Integer   codigo        Código de la acción a buscar su permisología en tablas.
//VALOR DE RETORNO:      String    patron        Patrón para filtrar la lista.   
//---------------------------------------------------------------------------------------------------------------------------
function obtTabAccion(funSucc,codigo=null,patron=""){

    var a=Array("m_modulo","tabla","m_accion","listar",
                "patron",patron,"codigo",codigo);
     ajaxMVC(a,funSucc,error);
}
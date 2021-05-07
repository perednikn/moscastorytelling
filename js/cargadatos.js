//_______________________________________VARIABLES Y CONSTANTES_______________________________________//
const detalleSesiones = $("#detalleSesiones");
const btnCreaSesion = $("#agregaSesion");
const btnLimpiaForm = $(".limpiaForm");
const btnValidaAdmin = $("#validaAdmin");
const btnFiltrarMatamoscas = $("#filtroAgenda");
const btnAgregaCarrito = $(".agregaCarrito");
const carritoPantalla = $(".sesionCarrito");
const btnLimpiaCarrito = $(".btnLimpiaCarrito");
const btnReserva = $(".btnReserva");
const detalleCarrito = $(".detalleCarrito");
const mailReserva = $("#mailReserva");
const ls = localStorage;

let confirmaReserva = $("#confirmaReserva");
let carrito = [];
let campo = "";
let sesiones = "";
let formulario = $("#nuevaSesion");
let filtroMatamoscas = false;
let tituloAgenda = $("#tituloAgenda");
let idBTN = "";

let verCarrito = null;

//Variables para la creación de nueva sesión desde pantalla
const presentador = $("#presentadorNuevaSesion");
const nombre = $("#nombreNuevaSesion");
const fecha = $("#fechaNuevaSesion");
const modalidad = $("#modalidadNuevaSesion");
const tematica = $("#tematicaNuevaSesion");
const narradores = $("#narradoresNuevaSesion");


//_______________________________________FUNCIONES_______________________________________//


//Carga realizada al cargar el DOM   
function cargaInicial() {


    cargoSesiones();
    recuperaStorage();
    confirmaReserva.css("display", "none");
    formulario.click(function (event) {
        event.preventDefault();
    });

    actualizoCarritoRefresh();
}
//Carga sesiones de JSON en tabla de próximas fechas
let cargoSesiones = () => {

    detalleSesiones.html("");
    for (let sesiones of SESIONES) {
        let tipoModalidad = "Matamoscas";
        if (sesiones.modalidad == false) {
            tipoModalidad = "Tradicional"
        }

        let fila = `<tr>
                    <td>${sesiones.fecha}</td>
                    <td>${sesiones.nombre}</td>
                    <td>${sesiones.tematica}</td>
                    <td>${tipoModalidad}</td>
                    <td>${sesiones.narradores}</td>
                    <td>${sesiones.presentador}</td>
                    <td><a class="btn-floating btn-large waves-effect waves-light grey"  onclick="sesionAlCarrito(${sesiones.sesionID})" id="${idBTN}"><i class="material-icons">event</i></a></td>

                <tr>`
        detalleSesiones.append(fila);
        tituloAgenda.text("Próximas sesiones");
    }

}
//Carga sólo sesiones competitivas del JSON en la tabla
let filtroSesiones = () => {
    if (filtroMatamoscas == false) {
        detalleSesiones.html("");
        for (let sesiones of SESIONES) {
            let tipoModalidad = "Matamoscas";
            idBTN = "btn" + sesiones.sesionID;


            if (sesiones.modalidad == true) {

                let fila = `<tr>
                            <td>${sesiones.fecha}</td>
                            <td>${sesiones.nombre}</td>
                            <td>${sesiones.tematica}</td>
                            <td>${tipoModalidad}</td>
                            <td>${sesiones.narradores}</td>
                            <td>${sesiones.presentador}</td>
                            <td><a class="btn-floating btn-large waves-effect waves-light grey"  onclick="sesionAlCarrito(${sesiones.sesionID})" id="${idBTN}"><i class="material-icons">event</i></a></td>

                        <tr>`
                detalleSesiones.append(fila);
                tituloAgenda.text("Próximas sesiones competitivas");
            }

        }
        btnFiltrarMatamoscas.html(`<div class="row"><button class="btn-large botonPropio">Ver todas</button></div> `);
        filtroMatamoscas = true;
    } else {
        btnFiltrarMatamoscas.html(`<div class="row"><button class="btn-large botonPropio" id="filtroAgenda"> Ver Matamoscas</button> </div>`);
        filtroMatamoscas = false;
        cargoSesiones();
    }
}
//Crea una nueva sesión en base a los datos ingresados x usuario
function creaSesionDOM() {
    let creaNombre = $("#nombreNuevaSesion").val();
    let creaFecha = $("#fechaNuevaSesion").val();
    let creaModalidad = $("#modalidadNuevaSesion").val();
    let creaTematica = $("#tematicaNuevaSesion").val();
    let creaNarradores = $("#narradoresNuevaSesion").val();
    let creaPresentador = $("#presentadorNuevaSesion").val();

    if (creaNombre != "" && creaFecha != "" && creaModalidad != null && creaTematica != "" && creaNarradores != "" && creaPresentador != ""){
        let modalidadGuardar = true;
        if (creaModalidad === "false") {
            modalidadGuardar = false;
        }
        let sesionNueva = { fecha: creaFecha, nombre: creaNombre, tematica: creaTematica, modalidad: modalidadGuardar, narradores: creaNarradores, presentador: creaPresentador }

        SESIONES.push(sesionNueva);

        /*Cuando Graba una nueva Sesion, elimina el registro del local Storage*/
        limpiaStorage();
        cargoSesiones();
        formulario.animate({ opacity: '0.0' }, "slow");
        formulario.slideUp(1000);
        formulario.hidden;
        M.toast({ html: 'Sesión registrada con éxito' })
        formulario.animate({ opacity: '1' }, "slow");
    
        //posiciona la pantalla en el div de la agenda
        $("html, body").animate({
            scrollTop: $(".agendaSesiones").offset().top
        }, 3000);  
    }else{
        M.toast({ html: 'Verfique la información ingresada y reintente para registrar correctamente la sesión' })
    }
}
//Guarda datos en storage según cambios de form
function cargaFormStorage(campo, valorCampo) {

    switch (campo) {
        case "nombre":
            ls.setItem("Nombre", valorCampo)
            break;
        case "fecha":
            ls.setItem("Fecha", valorCampo)
            break;
        case "tematica":
            ls.setItem("Tematica", valorCampo)
            break;
        case "narradores":
            ls.setItem("Narradores", valorCampo)
            break;
        case "presentador":
            ls.setItem("Presentador", valorCampo)
            break;
        case "modalidad":
            ls.setItem("Modalidad", valorCampo)
            break;
    }
}
//Carga en pantalla los datos del storage
function recuperaStorage() {
    nombre.val(ls.getItem("Nombre"));
    fecha.val(ls.getItem("Fecha"));
    tematica.val(ls.getItem("Tematica"));
    narradores.val(ls.getItem("Narradores"));
    presentador.val(ls.getItem("Presentador"));
    modalidad.val(ls.getItem("Modalidad"));

}
//limpia el storage y el form de Nueva Sesion
function limpiaStorage() {
    nombre.val("");
    fecha.val("");
    tematica.val("");
    narradores.val("");
    presentador.val("");
    modalidad.val('opcion');
    modalidad.formSelect();
    

    ls.setItem("Nombre", "");
    ls.setItem("Fecha", "");
    ls.setItem("Tematica", "");
    ls.setItem("Narradores", "");
    ls.setItem("Presentador", "");
    ls.setItem("Modalidad", "");
}
//Valida permiso para crear sesión y muestra form
function permisoSesion() {
    let respuesta = prompt("Ingrese su contraseña para poder agregar una sesión");
    let claveAdmin = "1234";

    if (respuesta == claveAdmin) {
        formulario.fadeIn(2000);
        muevePantalla("formulario")
    } else {
        
        M.toast({ html: 'No tiene permiso para crear una nueva sesión' })
    }

}
//Cierra el form de nueva sesión y muestra agenda
function cierraForm(){

    formulario.slideUp(1000);
    muevePantalla(`proximas`);
}
//Agrega sesiones al carrito
function sesionAlCarrito(id) {

    let sesionesEnCarrito = [];
    if (carrito != null){
    for (let reservaSesion of carrito) {
        sesionesEnCarrito.push(reservaSesion.sesionID);
    }
    }
    let sesionBuscar = id;
    sesionBuscar = JSON.stringify(sesionBuscar);
    if (sesionesEnCarrito.includes(sesionBuscar) == false) {
        let r = SESIONES.find(c => c.sesionID == id);
        carrito.push(r);

        actualizoCarrito();
        guardoCarrito();


        M.toast({ html: 'Sesión agregada al carrito' });
    } else {

        M.toast({ html: 'Ya tiene una reserva para esta sesión en su carrito' });
    }


}
//Actualiza carrito obteniendo datos del LS al refrescar la página
let actualizoCarritoRefresh = () => {
    
    let recuperoCarrito = ls.getItem("carrito");
    let leyendaCarrito = null;
    if (recuperoCarrito != null) {
        carrito = JSON.parse(recuperoCarrito);
        leyendaCarrito = `Actualmente tiene: <span class="numeroCarrito"> ${carrito.length} </span> prereservas`
    } else {
        leyendaCarrito = `Actualmente tiene: <span class="numeroCarrito"> 0 </span> prereservas`
    }
    carritoPantalla.html(leyendaCarrito);
}
//Actualiza carrito en pantalla
let actualizoCarrito = () => {

    let leyendaCarrito = `Actualmente tiene: ${carrito.length} prereservas`
    carritoPantalla.html(leyendaCarrito);



}
//Si carrito tiene contenido, lo guarda en storage
const guardoCarrito = () => {
    if (carrito.length > 0)
        localStorage.carrito = JSON.stringify(carrito)

}
//Vacía el carrito y resetea storage de carrito
const limpiaCarrito = () => {

    localStorage.carrito = "";
    carrito = [];
    M.toast({ html: 'Su carrito fue limpiado' });
}
//Muestra carrito en pantalla y visualiza form para confrimar reserva
function reservar() {
    $("#detalleSesionesCarrito").html("");
    for (let elemento of carrito) {
        let itemReserva = `<tr>
        <td>${elemento.fecha}</td>
        <td>${elemento.nombre}</td>
        <td>${elemento.tematica}</td>
        
        
        <td><a class="btn-floating btn-large waves-effect waves-light red"  onclick="eliminaReserva(${elemento.sesionID})" id="${idBTN}"><i class="material-icons">clear</i></a></td>

    <tr>`
        $("#detalleSesionesCarrito").append(itemReserva);
    }

}
//Elimina un item del carrito de reserva
function eliminaReserva(IDsesion) {

    //Crea un nuevo array con los elementos del carrito que se siguen manteniendo
    let elementosNuevoCarrito = [];
    for (let elemento of carrito) {
        if (elemento.sesionID != IDsesion) {
            elementosNuevoCarrito.push(elemento);
        }
    }
    //reemplaza carrito viejo con los nuevos elementos, borrando el elegido
    if (elementosNuevoCarrito.length > 0) {

        carrito = elementosNuevoCarrito;
        guardoCarrito();
        reservaSesiones();
        M.toast({ html: 'Su carrito fue actualizado correctamente' });

    } else {

        M.toast({ html: 'Su carrito quedó vacío, puede elegir una sesión de nuestra agenda' });
        limpiaCarrito();
        muestroAgenda();

    }

}
//Envía mail y carrito de reserva mediante método POST
function enviarReserva(mail, carrito) {
    if (mailReserva.val() != "") {
                M.toast({ html: 'Tu reserva fue efectuada. En los próximos días te contactaremos por mail para más detalles' });
                muestroAgenda();
                limpiaCarrito();
                actualizoCarritoRefresh();

            }else {
        M.toast({ html: 'Ingrese un mail para poder generar su reserva' });
    }
}
//Muestra los botones de Reserva - Limpiar en carrito
function botonReserva() {

    carritoPantalla.html(`<button class="btn botonPropio" id="btnReserva" onclick="reservaSesiones()"> RESERVÁ</button>
    <button class="btn botonPropio red" onclick="limpiaCarrito()">Limpiá carrito</button>`);
}
//Muestra carrito completo para poder efectuar reserva, Oculta agenda
function reservaSesiones() {

    if (carrito.length != 0) {


        $(".agendaSesiones").fadeOut(1000, function () {

            $(".confirmaReserva").slideDown("slow");

        }
        )

        reservar();
    } else {
        M.toast({ html: 'Por favor agregue sesiones al carrito para reservar' })
    }
}
//Oculta detalle carrito y vuelve a mostrar agenda
function muestroAgenda() {
    actualizoCarrito()
    $(".confirmaReserva").slideUp("slow", function () {
        $(".agendaSesiones").fadeIn(1000);
    });
}
//animación jQuery para posicionar pantalla
function muevePantalla(destino){
   let ubicacion = "";
    switch (destino) {
        case "proximas":
            $("html, body").animate({
                scrollTop: $("#sesionesPlanificadas").offset().top
            }, 3000);  
            break;
        case "conocenos":
            $("html, body").animate({
                scrollTop: $("#conocenos").offset().top
            }, 3000);  
            break;
        case "inicio":
            $("html, body").animate({
                scrollTop: $("#inicio").offset().top
            }, 3000);  
            break;
        case "formulario":
            $("html, body").animate({
                scrollTop: formulario.offset().top
            }, 3000);  
            break;
        }
      
   
  


}

//_______________________________________EVENTOS_______________________________________//
$(document).ready(cargaInicial());
btnCreaSesion.click(creaSesionDOM);
btnFiltrarMatamoscas.click(filtroSesiones);
btnLimpiaForm.click(limpiaStorage);
btnValidaAdmin.click(permisoSesion);
btnLimpiaCarrito.click(limpiaCarrito);
btnReserva.click(reservar);
carritoPantalla.hover(botonReserva, actualizoCarrito);
$(".cerrarForm").click(cierraForm);



nombre.change(() => cargaFormStorage(nombre.attr('name'), nombre.val()));
fecha.change(() => cargaFormStorage(fecha.attr('name'), fecha.val()));
tematica.change(() => cargaFormStorage(tematica.attr('name'), tematica.val()));
narradores.change(() => cargaFormStorage(narradores.attr('name'), narradores.val()));
presentador.change(() => cargaFormStorage(presentador.attr('name'), presentador.val()));
modalidad.change(() => cargaFormStorage(modalidad.attr('name'), modalidad.val()));


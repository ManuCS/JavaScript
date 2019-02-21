let palabras = [];

//Lo pongo así para que ocupe la posición 0 y tener libres a partir de la 1.
let posiciones = [""];



$(document).ready(function () {

    //Pido el JSON
    $.ajax({
        url: "logogrifo.json",
        type: "GET",
        dataType: "json",
        success: function (data) {
            palabras = data;

            //Da números a las letras
            CreaPosiciones(palabras);

            //Presenta los inputs de cada letra de las palabras
            PresentaInputs(palabras);

            $('input').on('keypress', Comprueba);

        }
    });

    //Creo un array donde guardo las letras en orden de aparición y les asignaré como número su posición en este array
    function CreaPosiciones(palabras) {
        for (let i = 0; i < palabras.length; i++) {
            for (let j = 0; j < palabras[i].palabra.length; j++) {
                if (posiciones.indexOf(palabras[i].palabra[j]) == -1) {
                    posiciones.push(palabras[i].palabra[j]);
                }
            }
        }
    }

    //Presenta los inputs de las letras de cada palabra, estas envueltas en un div
    function PresentaInputs(palabras) {
        for (let i = 0; i < palabras.length; i++) {
            let div = "<div id='palabra" + i + "'><br>"
            $("#contenedor").append(div);

            for (let j = 0; j < palabras[i].palabra.length; j++) {
                console.log(palabras[i].palabra[j]);
                console.log(posiciones.indexOf(palabras[i].palabra[j]));
                var casilla = "<input type='text' class='lgrifo btn-info' maxlength='1' placeholder='"+posiciones.indexOf(palabras[i].palabra[j])+"'>";
                var selector = "#palabra" + i;
                $(selector).append(casilla);
            }
            $(selector).append("<br>" + palabras[i].pista);
        }
        console.log($('input').length);
    }


    function Comprueba(){
        //array de inputs con sus propiedades
        let inputs = $('inputs');

        console.log(inputs);
    }



});


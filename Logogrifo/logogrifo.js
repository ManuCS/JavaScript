let palabras = [];

//Lo pongo así para que ocupe la posición 0 y tener libres a partir de la 1.
let posiciones = [""];


let arrayPalabra = [];



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

            $('input').on('keyup', Comprueba);

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
                // console.log(palabras[i].palabra[j]);
                // console.log(posiciones.indexOf(palabras[i].palabra[j]));
                //Pongo clase p + el número de palabra que le corresponde para luego comprobar y corregir
                var casilla = "<input type='text' class='lgrifo btn-info p" +i+"' maxlength='1' placeholder='"+posiciones.indexOf(palabras[i].palabra[j])+"'>";
                var selector = "#palabra" + i;
                $(selector).append(casilla);
            }
            $(selector).append("<br>" + palabras[i].pista);
        }
        // console.log($('input').length);
    }


    function Comprueba(){
        //array de inputs con sus propiedades
        let inputs = $('input');

        // console.log($(this).attr("placeholder"));
        // console.log(inputs[2].placeholder);

        for(let i = 0; i < inputs.length; i++){
            if($(this).attr("placeholder") === inputs[i].placeholder){
                inputs[i].value = $(this).val();
            }
        }

        let cont = 0;

        for(let i = 0; i < 6; i++){
            let inputsPalabra = $(".p"+i);
            
            for(j = 0; j < inputsPalabra.length; j++){
                if(/^[a-zA-Záéíóú]$/.test(inputsPalabra[j].value) == false){
                    cont++;
                    break;
                }
                else{
                    if(inputsPalabra[j].placeholder != posiciones.indexOf(inputsPalabra[j].value.toLowerCase())){
                        cont++;
                        break;
                    }
                }                
            }

            inputsPalabra = [];
        }


        if(cont == 0){
            $("input").removeClass("btn-info").addClass("btn-success").attr("disabled", "disabled");
            alert("¡Has ganado!")
        }
    }



});


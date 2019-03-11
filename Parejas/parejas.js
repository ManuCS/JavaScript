//Array de las cartas que voy a mostrar
let cartas = ["draco.jpg", "buckbeak.jpg", "dumbledore.jpg", "fredgeorge.jpg", "harry.jpg", "hedwig.jpg", "hermione.jpg", "james.jpg", "lupin.jpg", "ron.jpg", "sirius.jpg", "snape.jpg"];
const BACK = "back2.png";
let comprueba = [];
//Contador de movimientos que vaya realizando el usuario
let movimientos = 0;
let aciertos = 0;
let sec = 0;
let min = 0;
let intervalo;


$(document).ready(function () {
    Presenta(cartas);
});


function Desordena(cartas) {
    let desordenadas = cartas;
    desordenadas = desordenadas.concat(cartas);

    desordenadas.sort(function () { return 0.5 - Math.random() });
    return desordenadas;
}

function Presenta(cartas) {
    $(".tablero").empty();
    $(".movimientos").text("Movimientos: 0");
    $(".aciertos").text("Aciertos: 0");
    comprueba = [];
    movimientos = 0;
    aciertos = 0;
    sec = 0;
    min = 0;
    clearInterval(intervalo);
    $(".tiempo").text("0 min 0 seg");

    let desordenadas = Desordena(cartas);
    let salida = "";

    for (let i = 0; i < desordenadas.length; i++) {
        salida += `<div id='card${i}' class='card' onclick='Comprueba(this)'>`;
        salida += `<div class='front'><img src='cartas/${BACK}'></div>`;
        salida += `<div class='back'><img src='cartas/${desordenadas[i]}'></div></div>`;
    }

    $(".tablero").append(salida);
    $(".card").flip({
        trigger: 'click'
    });

}



function Comprueba(carta) {

    // comprueba.push($(carta).find("img").eq(1).attr("src"));

    comprueba.push(carta);
    $(carta).attr("disabled", true).css("pointer-events", "none");


    if (comprueba.length === 2) {
        //Aumento los movimientos
        movimientos++;
        $(".movimientos").text(`Movimientos: ${movimientos}`);

        if (movimientos === 1) {
            Cronometro();
        }

        //Si coinciden, hago que se muestre la cara frontal de la carta y deshabilito que se pueda clickear.
        if ($(comprueba[0]).find("img").eq(1).attr("src") === $(comprueba[1]).find("img").eq(1).attr("src")) {
            $(comprueba[0]).addClass("match").removeClass("card");
            $(comprueba[1]).addClass("match").removeClass("card");

            $(comprueba[0]).attr("disabled", true).css("pointer-events", "none");
            $(comprueba[1]).attr("disabled", true).css("pointer-events", "none");

            comprueba = [];
            aciertos++;
            $(".aciertos").text(`Aciertos: ${aciertos}`);

            if (aciertos == cartas.length) {
                clearInterval(intervalo);
                let usuario = prompt("¡Has ganado! Introduce tu nombre de usuario: ");
                let tiempo = (min * 60) + sec;
                Ranking(usuario, tiempo, movimientos);
                let confirmar = confirm("¿Quieres ver el ranking?");
                if (confirmar) {
                    ObtenRanking();
                }
            }

        }
        else {
            $(comprueba[0]).flip(true).attr("disabled", true);
            $(comprueba[1]).flip(false).attr("disabled", true);

            $(".card").attr("disabled", true).css("pointer-events", "none");

            setTimeout(function () {
                $(comprueba[0]).flip(false).attr("disabled", false).css("pointer-events", "auto");
                $(comprueba[1]).flip(false).attr("disabled", false).css("pointer-events", "auto");
                $(".card").attr("disabled", true).css("pointer-events", "auto");

                comprueba = [];

            }, 1100);

        }
    }
}

function Cronometro() {
    intervalo = setInterval(function () {
        var tiempo = `${min} min ${sec} seg`;
        $(".tiempo").text(tiempo);

        sec++;

        if (sec == 60) {
            min++;
            sec = 0;
        }
    }, 1000);
}


function Ranking(usuario, tiempo, movimientos) {
    $.ajax({
        url: "graba.php",
        method: "POST",
        data: { usuario: usuario, tiempo: tiempo, movimientos: movimientos },
    });
}

function ObtenRanking() {
    $.ajax({
        url: "ranking.txt",
        dataType: "text",
        success: function (data) {
            let cadena = data;
            MuestraRanking(cadena);
        }
    });
}

function MuestraRanking(cadena){
    $(".juego").empty();
    
    function Usuario(usuario, tiempo, movimientos){
        this.usuario = usuario;
        this.tiempo = tiempo;
        this.movimientos = movimientos;
    }

    let usuarios = []

    let juegos = cadena.split("|");



    for(let i = 0; i < juegos.length; i++){
        let partidas = juegos[i].split(";");

        let usuario = partidas[0];
        let tiempo = partidas[1];
        let movimientos = partidas[2];

        usuarios.push(new Usuario(usuario, tiempo, movimientos));
    }

    usuarios.sort(function (a, b){
        if (a.tiempo >= b.tiempo) {
            return 1;
          }
          if (a.tiempo < b.tiempo) {
            return -1;
          }
    });


    let salida = "<ol>";
    for(let i = 0; i < usuarios.length - 1; i++){
        salida += `<li>${usuarios[i].usuario} -> ${usuarios[i].tiempo} segundos, ${usuarios[i].movimientos} movimientos</li>`;
    }

    salida += "</ol>";

    $(".juego").html(salida);

}
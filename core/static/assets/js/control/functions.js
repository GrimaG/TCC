function isolateRGB(color) {
    document.getElementById("progress-bar-img").style.width = "25%";
}

function reduceNoise() {
    document.getElementById("progress-bar-img").style.width = "50%";
}

function otsu() {
    document.getElementById("progress-bar-img").style.width = "75%";
}

function morfology(type) {
    document.getElementById("progress-bar-img").style.width = "100%";
}

var img_set = 1;
function setImage(img_name, img) {
    document.getElementById("img-text-" + img_set).innerHTML = img_name;
    document.getElementById("img-" + img_set).src = img;
    if (img_set == 1) {
        img_set = 2;
    } else {
        img_set = 1;
    }
}

var img_1;
var img_2;
var main_img;
var not_main_img;
var main_width;
var main_height;


function readURL(event, endpoint) {
    var getImagePath = URL.createObjectURL(event.target.files[0]);
    //console.log(event.target.files[0]); 
    getBase64(event.target.files[0], endpoint);
    $('#' + endpoint).css('background-image', 'url(' + getImagePath + ')');
}

function getBase64(file, endpoint) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        // console.log(reader.result);
        if (endpoint == "img-1") {
            img_1 = reader.result;
            $('#select-1').css('background-image', 'url(' + img_1 + ')');
        } else {
            img_2 = reader.result;
            $('#select-2').css('background-image', 'url(' + img_2 + ')');
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

function setMain(img, div_img) {
    if (img == 1) {
        main_img = img_1;
        not_main_img = img_2;
        //set atributo borda
        getDimentions('#select-1');
        initCanvas();
        $('#select-1').css('border', '5px solid #73AD21');
        $('#select-2').css('border', '1px solid #bbb');
    } else {
        main_img = img_2;
        not_main_img = img_1;
        getDimentions('#select-2');
        initCanvas();
        $('#select-2').css('border', '5px solid #73AD21');
        $('#select-1').css('border', '1px solid #bbb');
    }
    //setImageOnCanvas();
}

function setMainToSend(img, div_img) {
    if (img == 1) {
        main_img = img_1;
        $('#send-1').css('border', '5px solid #73AD21');
        $('#send-2').css('border', '1px solid #bbb');
    } else {
        main_img = img_2;
        $('#send-2').css('border', '5px solid #73AD21');
        $('#send-1').css('border', '1px solid #bbb');
    }
    //setImageOnCanvas();
}
function getDimentions(id_img) {
    var actualImage = new Image();
    actualImage.src = $(id_img).css('background-image').replace(/"/g, "").replace(/url\(|\)$/ig, "");

    main_width = actualImage.width // The actual image width
    main_height = actualImage.height // The actual image height
}


function initCanvas() {
    $('#edit-canvas').remove();
    var canvasDiv = document.getElementById('canvasDiv');
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', "edit-canvas");
    canvas.setAttribute('width', main_width);
    canvas.setAttribute('height', main_height);
    canvasDiv.appendChild(canvas);
    if (typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d");
    base_image = new Image();
    base_image.src = main_img;
    base_image.onload = function () {
        context.drawImage(base_image, 0, 0);

    }
    var canvas = document.getElementById('edit-canvas');
    var context = canvas.getContext('2d');

    canvas.addEventListener('click', function (evt) {
        var mousePos = getCursorPosition(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        writeLine(canvas, mousePos);
    }, false);
    //initCanvas2();
}

function initCanvas2(draw) {
    $('#edit-canvas2').remove();
    var canvasDiv = document.getElementById('canvasDiv2');
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', "edit-canvas2");
    canvas.setAttribute('width', main_width);
    canvas.setAttribute('height', main_height);
    canvasDiv.appendChild(canvas);
    if (typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d");
    var first_canvas = document.getElementById('edit-canvas');
    var base_image = new Image();
    base_image.src = first_canvas.toDataURL();
    base_image.onload = function () {
        context.drawImage(base_image, 0, 0);
        context.beginPath();
        context.moveTo(draw.x_final, draw.y_final);
        context.lineTo(draw.x_inicial, draw.y_inicial);
        context.lineWidth = 7;
        context.strokeStyle = '#ff0000';
        context.stroke();
        main_img = canvas.toDataURL();
        initCanvas3(draw);
    }
    var canvas = document.getElementById('edit-canvas2');
    var context = canvas.getContext('2d');
    

    canvas.addEventListener('click', function (evt) {
        var mousePos = getCursorPosition(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        savePosition(canvas, mousePos);
    }, false);
}
function initCanvas3(draw) {
    $('#edit-canvas3').remove();
    var canvasDiv = document.getElementById('canvasDiv3');
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', "edit-canvas3");
    canvas.setAttribute('width', main_width);
    canvas.setAttribute('height', main_height);
    canvasDiv.appendChild(canvas);
    if (typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d");
    var base_image = new Image();
    base_image.src = not_main_img;
    base_image.onload = function () {
        context.drawImage(base_image, 0, 0);
        context.beginPath();
        context.moveTo(draw.x_final, draw.y_final);
        context.lineTo(draw.x_inicial, draw.y_inicial);
        context.lineWidth = 7;
        context.strokeStyle = '#ff0000';
        context.stroke();

         var first_canvas = document.getElementById('edit-canvas3');
         not_main_img =  first_canvas.toDataURL();
    }
    var canvas = document.getElementById('edit-canvas3');
    var context = canvas.getContext('2d');
   
}

var position_cut;
function savePosition(canvas, mousePos) {
    position_cut = mousePos;
    document.getElementById("x").innerHTML = 'X = ' + mousePos.x;
    document.getElementById("y").innerHTML = 'Y = ' + mousePos.y;
}
function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
var qtd_click = 0;
var allowedToDrow = true;
var old_codinates = {
    x: "",
    y: ""
};
function writeLine(canvas, mousePos) {
    if (allowedToDrow) {
        qtd_click += 1;
        if (qtd_click == 2) {

            var ctx = canvas.getContext("2d");

            //corrigindo primeiro problema
            var width_canvas = document.getElementById('edit-canvas').scrollWidth;
            var height_canvas = document.getElementById('edit-canvas').scrollHeight;
            var adapt_x = main_width / width_canvas;
            var adapt_y = main_height / height_canvas;
            /*
             var draw = {
                 x_inicial: old_codinates.x,
                 x_final: mousePos.x,
                 y_inicial: old_codinates.y,
                 y_final: mousePos.y
             }
             */
            var draw = equacaoReta(old_codinates.x * adapt_x, old_codinates.y * adapt_y, mousePos.x * adapt_x, mousePos.y * adapt_y, main_width, main_height);
            ctx.beginPath();
            //ctx.moveTo(draw.x_final, draw.y_final);
            //ctx.lineTo(draw.x_inicial, draw.y_inicial);
            ctx.moveTo(old_codinates.x * adapt_x, old_codinates.y * adapt_y);
            ctx.lineTo( mousePos.x * adapt_x, mousePos.y * adapt_y);
            ctx.lineWidth = 7;
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();

            initCanvas2(draw);
            allowedToDrow = false;
        } else {
            old_codinates = mousePos;
        }
    }
}

function resetCanvas(){
    allowedToDrow = true;
    qtd_click = 0;
    initCanvas();
}





function setImageOnCanvas() {
    var canvas = document.getElementById('edit-canvas'),
        context = canvas.getContext('2d');
    make_base(context, canvas);
}

function make_base(context, canvas) {
    base_image = new Image();
    base_image.src = main_img;
    base_image.onload = function () {
        context.drawImage(base_image, 0, 0);

    }

}

function equacaoReta(xa, ya, xb, yb, x_max, y_max) {
    //coeficiente angular da reta
    var m = (yb - ya) / (xb - xa);
    // y - ya = m (x - xa) -> equaçao da reta
    // achar o valor de  y no ponto em que x = 0
    // y = (m*0-m*xa)+ya 
    var y_ini = (m * 0 - m * xa) + ya;
    if(y_ini<0){
        y_ini=0;
    }else {
        if(y_ini>y_max){
            y_ini = y_max;
        }
    }
    // achar y no ponto de extremidade de x
    var y_fim = (m * x_max - m * xa) + ya;

     if(y_fim<0){
        y_fim=0;
    }else {
        if(y_fim>y_max){
            y_fim = y_max;
        }
    }
    //achar o x para o ponto y=0 
    // x = (0-ya+m*xa)/m;
    var x_ini = (y_ini - ya + m * xa) / m;
    // achar o ponto x de extremidade de y
    var x_fim = (y_fim - ya + m * xa) / m;
    return {
        x_inicial: x_ini,
        y_inicial: y_ini,
        x_final: x_fim,
        y_final: y_fim
    };
}

var applyMorphology = [];
function insertMorphology(name){
    applyMorphology.push(name);
    var txt_val='';
    for (element in applyMorphology){
          txt_val += applyMorphology[element] + '<br>'
    }  
    document.getElementById('fillBox').innerHTML = txt_val;
}

function zeroMorphology(){
    applyMorphology = [];
    document.getElementById('fillBox').innerHTML = ""
}

class Transaction{
    constructor(radioValue, noiseLevel, otsuThreshold, applyMorphology , img){
        this.channel= radioValue;
        this.noise= noiseLevel;
        this.otsu = otsuThreshold;
        this.morphology = applyMorphology;
        this.img_old =  img;
    }
}

function send(){
    document.getElementById('jssor_1_div').innerHTML ="";
    document.getElementById('jssor_2_div').innerHTML ="";
    var radioValue = $("input[name='color']:checked").val();
    var noiseLevel = $("#ruido").val();
    var otsuThreshold = document.getElementById('otsu').checked;
    var transaction1 = new Transaction(radioValue, noiseLevel, otsuThreshold, applyMorphology , img_1);
    var send_object1 = JSON.stringify(transaction1); 
    var transaction2 = new Transaction(radioValue, noiseLevel, otsuThreshold, applyMorphology , img_2);
    var send_object2 = JSON.stringify(transaction2);
    total_request +=2;
    request("/channel/", send_object1, 1);
    request("/channel/", send_object2, 2);
}
var img_process_1;
var img_process_2;

var counter_data=0;
var total_request = 0;
function request(address, data, nro){
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (xhttp2.readyState == XMLHttpRequest.DONE) {
            insertIntocarrousel(xhttp2.responseText, nro);
            if(nro==1){
                img_process_1 = xhttp2.responseText;
            }else{
                img_process_2 = xhttp2.responseText;
            }
            counter_data+=1;
            if(counter_data == total_request){
                loadNext(data);
            }
        }   
    }
    xhttp2.open("POST", address);
    xhttp2.setRequestHeader('Content-Type' , 'application/json');
    xhttp2.send(data);
}

function loadNext(data){
    var req="";
    if(counter_data == 2){
        total_request +=2;
        req = "/noise/";
        console.log("ruido");
        
    }
    if(counter_data==4){
        if(document.getElementById('otsu').checked){
         total_request +=2;
         req = "/otsu/";
         console.log("otsu");
        }
    }
    if(counter_data==6){
        if(applyMorphology.length>0){
            total_request +=2;
            req = "/morphologys/";
            console.log("morphology");
        }
         
    }
    if(req!=""){
        var tmp_data = JSON.parse(data);
        tmp_data.img_old = img_1;
        data = JSON.stringify(tmp_data);
        request(req, data, 1);
        tmp_data.img_old = img_2;
        data = JSON.stringify(tmp_data);
        request(req, data, 2);
    }else{
        counter_data = 0;
        total_request = 0;
        loadCarroussel();
    }

}
function loadCarroussel(){
 var jssor_1_options = {
        $AutoPlay: true,
        $ArrowNavigatorOptions: {
            $Class: $JssorArrowNavigator$
        },
        $ThumbnailNavigatorOptions: {
            $Class: $JssorThumbnailNavigator$,
            $Cols: 9,
            $SpacingX: 3,
            $SpacingY: 3,
            $Align: 260
        }
    };

 var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);

            /*responsive code begin*/
            /*remove responsive code if you don't want the slider scales while window resizing*/
    function ScaleSlider() {
        var refSize = jssor_1_slider.$Elmt.parentNode.clientWidth;
        if (refSize) {
            refSize = Math.min(refSize, 600);
            jssor_1_slider.$ScaleWidth(refSize);
        }
        else {
            window.setTimeout(ScaleSlider, 30);
        }
    }
    ScaleSlider();
    $(window).bind("load", ScaleSlider);
    $(window).bind("resize", ScaleSlider);
    $(window).bind("orientationchange", ScaleSlider);
            /*responsive code end*/
    var jssor_2_slider = new $JssorSlider$("jssor_2", jssor_1_options);

    /*responsive code begin*/
    /*remove responsive code if you don't want the slider scales while window resizing*/
    function ScaleSlider2() {
        var refSize = jssor_2_slider.$Elmt.parentNode.clientWidth;
        if (refSize) {
            refSize = Math.min(refSize, 600);
            jssor_2_slider.$ScaleWidth(refSize);
        }
        else {
            window.setTimeout(ScaleSlider2, 30);
        }
    }
    ScaleSlider2();
    $(window).bind("load", ScaleSlider2);
    $(window).bind("resize", ScaleSlider2);
    $(window).bind("orientationchange", ScaleSlider2);
    /*responsive code end*/
    /*Fechar modal */ 
    closeModal();

}

function insertIntocarrousel(img, nro){
    document.getElementById('jssor_'+nro +'_div').innerHTML += '<div><img data-u="image" src="'+ img + '" /><img data-u="thumb" src="'+ img + '" /></div>';
}

function closeModal(){
    $("#second").show()
    window.location.href =  "#close";
}

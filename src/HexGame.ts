var hexes: Array<Hex>;
var hexCounter: Array<number>;
var metalLevel: number;
var hexMap: Array<Array<Hex>>;
var uiCanvas, objectCanvas, hitCanvas, effectCanvas: HTMLCanvasElement;
var uiCtx, objectCtx, hitCtx, effectCtx: CanvasRenderingContext2D;
var hexesImg: HTMLImageElement;
var uiImg: HTMLImageElement;
var filesLoaded: number = 0;
var numberOfFiles: number = 3;
var loading: boolean;
var selectedHexes: Array<Hex>;
var mapsByteArray: Uint8Array;
var colorsHash: Array<object>;
var hexIndicators: Array<HexIndicator>;
var newGameButton: NewGameButton;
var helpButton: HelpButton;
var difficultyButton: DifficultyButton;
var gameStarted: boolean;
var wins: Array<number>;
var hoveredObject;
var lastScale: number;
var scale: number;
var defCanvasWidth: number;
var defCanvasHeight: number;
var difficulty: number;

var maxHexCount: Array<number>;

/*enum Marbvarype {
    Salt,       //0
    Water,
    Fire,
    Earth,
    Air,
    Quicksilver,//5
    Lead,       //6
    Tin,
    Iron,
    Copper,
    Silver,     //10
    Gold,       //11
    Mors,       //12
    Vitae,      //13
    QUINTESSENCE // 14
}*/

function xInDirection(x: number, y : number, direction: number) : number {
    switch(direction) {
        case 0:
        case 2: {
            return x + (y % 2);
        }
        case 1: {
            return x + 1;
        }
        case 3:
        case 5: {
            return x - 1 + (y % 2);
        }
        case 4: {
            return x - 1;
        }
        default: {
            return x;
        }
    }
}

function yInDirection(y : number, direction: number) : number {
    switch(direction) {
        case 0:
        case 5: {
            return y - 1;
        }
        case 1:
        case 4: {
            return y;
        }
        case 2:
        case 3: { 
            return y + 1;
        }
        default: {
            return y;
        }
    }
}

function initialize() {
    uiImg = new Image();
    hexesImg = new Image();
    loading = false;
    colorsHash = new Array<object>();
    gameStarted = false;
    lastScale = 1;
    defCanvasWidth = 830;
    defCanvasHeight = 863;
    newGameButton = new NewGameButton();
    helpButton = new HelpButton();
    difficultyButton = new DifficultyButton();
    wins = new Array();
    difficulty = 0;

    uiCanvas = <HTMLCanvasElement>document.getElementById("uiCanvas");
    uiCtx = uiCanvas.getContext("2d");

    objectCanvas = <HTMLCanvasElement>document.getElementById("objectCanvas");
    objectCtx = objectCanvas.getContext("2d");
    objectCtx.textAlign = "center";

    hitCanvas = <HTMLCanvasElement>document.getElementById("hitCanvas");
    hitCtx = hitCanvas.getContext("2d");
    
    effectCanvas = <HTMLCanvasElement>document.getElementById("effectCanvas");
    effectCtx = effectCanvas.getContext("2d");
    
    checkCookie();

    wins[0] = parseInt(getCookie("easy"));
    wins[1] = parseInt(getCookie("hard"));
    wins[2] = parseInt(getCookie("easyplus"));
    wins[3] = parseInt(getCookie("hardplus"));

    uiImg.onload = function() {
        uiCtx.drawImage(uiImg, 0,0,defCanvasWidth, defCanvasHeight);
        filesLoaded++;
    };
    uiImg.src="images/ui.png";
    hexesImg.onload = function() {
        filesLoaded++;
    };
    hexesImg.src="images/hexes.png";

    var oReq = new XMLHttpRequest();
    oReq.open("GET", "40000mixed.dat", true);
    oReq.responseType = "arraybuffer";
    
    oReq.onload = function (oEvent) {
        var arrayBuffer = oReq.response; // Note: not oReq.responseText
        if (arrayBuffer) {
          mapsByteArray = new Uint8Array(arrayBuffer);
          filesLoaded++;
        }
    };
    oReq.send(null);

    AddUIButtons();

    

    drawHit();
    draw();

    //doScaling();

    //setInterval(draw,16.66666666);
}

function updateGame() {
    for(var i = 0; i < hexes.length; i++)
    {
        hexes[i].update();
    }
    draw();
}

function draw() {
    objectCtx.clearRect(0, 0, defCanvasWidth, defCanvasHeight);
    effectCtx.clearRect(0, 0, defCanvasWidth, defCanvasHeight);
    if(hexes)
        hexes.forEach(hex => {
            hex.draw();
        });
    if(hexIndicators)
        hexIndicators.forEach(hexIndicator => {
            hexIndicator.draw();
        });  
    newGameButton.draw();
    helpButton.draw();
    difficultyButton.draw();
    drawWins();
    drawDifficultyLevel();

    /*if(selectedHexes) {
        var i = 0;
        selectedHexes.forEach(element => {
            objectCtx.fillText(element.type.toString(),20,20 + i * 20)
            i++
        });
    }*/

}

function drawHit() {
    hitCtx.clearRect(0, 0, defCanvasWidth, defCanvasHeight);
    if(hexes)
    hexes.forEach(hex => {
        hex.drawHit();
    });
    if(hexIndicators)
        hexIndicators.forEach(hexIndicator => {
            hexIndicator.drawHit();
        });  
    newGameButton.drawHit();
    helpButton.drawHit();
    difficultyButton.drawHit();
}

function newGame () {
    if(filesLoaded != numberOfFiles) {
        alert("Necessary files didn't load yet :(");
        return;
    }
    if(loading) {
        return;
    }
        
    loading = true;
    colorsHash = new Array<object>();
    
    gameStarted = true;

    hexes = new Array<Hex>();
    hexIndicators = new Array<HexIndicator>();
    hexMap = new Array<Array<Hex>>();
    maxHexCount = difficulty > 1 ? [4,8,8,8,8,5,1,1,1,1,1,1,3,3,2] : [4,8,8,8,8,5,1,1,1,1,1,1,4,4];
    hexCounter = difficulty > 1 ?  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] : [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    metalLevel = 0;
    selectedHexes = new Array<Hex>();

    for(var i = 0; i < 13; i++) {
        hexMap[i] = new Array<Hex>();
    }

    for(var i = 0; i < maxHexCount.length; i++) {
        hexIndicators[i] = new HexIndicator(i);
    }
    loadRandomMap();

    AddUIButtons();

    updateGame();
    drawHit();
    
    loading = false;
}

function changeDifficulty() {
    difficulty = (difficulty + 1) % 4;
    newGame();
}

function mouseDown(e) {
    var mousePos = getMousePos(objectCanvas, e);
    
    const pixel = hitCtx.getImageData(mousePos.x, mousePos.y, 1, 1).data;
    const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    const obj = colorsHash[color];
    if (obj) {
       obj.select();
    }
    mouseMove(e);
    if(hexes) {
        if(hexes.length == 0 && gameStarted) {
            gameStarted = false;
            wins[difficulty]++;
            setCookie("easy",wins[0]);
            setCookie("hard",wins[1]);
            setCookie("easyplus",wins[2]);
            setCookie("hardplus",wins[3]);
            draw();
    
        }
    }
    
}

function mouseMove(e) {
    var mousePos = getMousePos(objectCanvas, e);
    
    const pixel = hitCtx.getImageData(mousePos.x, mousePos.y, 1, 1).data;
    const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    const obj = colorsHash[color];
    if (obj) {
       obj.hover();
       draw();
    }
    else {
        if(hoveredObject) {
            hoveredObject.unhover();
            hoveredObject = undefined;
            draw();
        }

    }
}

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
}

function loadRandomMap() {
    var r = Math.floor(Math.random() * (mapsByteArray.length / 54 / 4));
    //var r = Math.floor(Math.random() * 2);

    new Hex(11, 6, 6, true);
    var hexCount = 0;


    for(var i = 0; i < maxHexCount.length; i++)
    {
        while (maxHexCount[i] != hexCounter[i])
        {
            var x = (mapsByteArray[difficulty * 10000 * 54 + r * 54 + hexCount] & 0xF0) >> 4;
            var y = mapsByteArray[difficulty * 10000 * 54 + r * 54 + hexCount] & 0x0F;
            new Hex(i,x,y, true);
            hexCount++;
        }
        
    }

}

function AddUIButtons() {
    newGameButton = new NewGameButton();
    helpButton = new HelpButton();
    difficultyButton = new DifficultyButton();
}

function ChangeScale(x: number) {
    scale = x;
    objectCanvas.width = defCanvasWidth * scale;
    objectCanvas.height = defCanvasHeight * scale;
    uiCanvas.width = defCanvasWidth * scale;
    uiCanvas.height = defCanvasHeight * scale;
    hitCanvas.width = defCanvasWidth * scale;
    hitCanvas.height = defCanvasHeight * scale;
    effectCanvas.width = defCanvasWidth * scale;
    effectCanvas.height = defCanvasHeight * scale;

    
    objectCtx.setTransform(scale,0,0,scale,0,0);
    uiCtx.setTransform(scale,0,0,scale,0,0);
    hitCtx.setTransform(scale,0,0,scale,0,0);
    effectCtx.setTransform(scale,0,0,scale,0,0);



    /*objectCtx.scale(scale/lastScale,scale/lastScale);
    uiCtx.scale(scale/lastScale,scale/lastScale);
    hitCtx.scale(scale/lastScale,scale/lastScale);
    effectCtx.scale(scale/lastScale,scale/lastScale);*/

    lastScale = scale;
    uiCtx.drawImage(uiImg, 0,0,defCanvasWidth, defCanvasHeight);
    draw();
    drawHit();
}

function doScaling() {
    var winWidth = window.innerWidth * 0.95;
    var winHeight = window.innerHeight * 0.85;
    var widthScale = winWidth / defCanvasWidth;
    var heightScale = winHeight / defCanvasHeight;
    if(widthScale < heightScale)
    {
        ChangeScale(widthScale);
    }
    else {
        ChangeScale(heightScale);
    }
    
}

function DeSelectAll() {
    selectedHexes.forEach(element => {
        element.selected = false;
    });
    selectedHexes = new Array();
}

function CanHexesBePaired(a : Hex,  b : Hex) : boolean {
    if (a.type < 5 || b.type < 5)
    {
        return a.type < 5 && b.type < 5 &&
               (a.type == b.type || a.type == 0 || b.type == 0);
    }
    if (a.type == 5 || b.type == 5)
    {
        return a.type == 5 && b.type > 5 && b.type < 11
               || b.type == 5 && a.type > 5 && a.type < 11;
    }
    
    return a.type == 12 && b.type == 13
           || a.type == 13 && b.type == 12;
}

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";expires=Tue, 01 Jan 2030 00:00:00 UTC;path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    document.cookie = "";
    var easy = getCookie("easy");
    var easyplus = getCookie("easyplus");
    var hard = getCookie("hard");
    var hardplus = getCookie("hardplus");
    if(easy == "") {
        setCookie("easy","0");
    }
    if(easyplus == "") {
        setCookie("easyplus","0");
    }
    if(hard == "") {
        setCookie("hard","0");
    }
    if(hardplus == "") {
        setCookie("hardplus","0");
    }
}

window.onload = ()=> { initialize(); }
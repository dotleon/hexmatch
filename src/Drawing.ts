function HexToCanvasX(x: number, y: number) : number {
    return 20  + x * 66 + (y % 2) * 33;
}

function HexToCanvasY(y: number) : number {
    return 71  + y * 57;
}

function hexSpriteX(type: number) : number {
    return type < 100 ? type * 60 : (type - 100) * 60;
}

function hexSpriteY(type: number) : number {
    return type < 100 ? 0 : 67;
}

function drawHitHex(x: number, y: number, size: number, color: string) {
    hitCtx.globalAlpha = 1;
    hitCtx.beginPath();
    hitCtx.moveTo(x + size * Math.cos(Math.PI / 6), y + size * Math.sin(Math.PI / 6));
    
    for (let side = 0; side < 7; side++) {
        hitCtx.lineTo(x + size * Math.cos(side * 2 * Math.PI / 6 + Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6 + Math.PI / 6));
    }
    
    hitCtx.fillStyle = color;
    hitCtx.fill();
}

function drawNewGameHit(color: string) {
    hitCtx.globalAlpha = 1;
    hitCtx.beginPath();
    hitCtx.moveTo(81,688);
    
    for (let side = 0; side < 7; side++) {
        hitCtx.lineTo(142,688);
        hitCtx.lineTo(162,722);
        hitCtx.lineTo(142,757);
        hitCtx.lineTo(81,757);
        hitCtx.lineTo(60,722);
        hitCtx.lineTo(81,688);
    }
    
    hitCtx.fillStyle = color;
    hitCtx.fill();
}

function drawNewGameSelected() {
    objectCtx.globalAlpha = 1;
    objectCtx.drawImage(hexesImg,
        95, 134,
        130, 102, 
        46, 672,
        130, 102);
}

function drawHelpSelected() {
    objectCtx.globalAlpha = 1;
    objectCtx.drawImage(hexesImg,
        226, 134,
        130, 102, 
        655, 672,
        130, 102);
}

function drawDifficultySelected() {
    objectCtx.globalAlpha = 1;
    objectCtx.drawImage(hexesImg,
        357, 134,
        130, 102, 
        46, 56,
        130, 102);
}

function drawDifficultyLevel() {

    objectCtx.globalAlpha = 1;
    objectCtx.save();
    objectCtx.shadowColor = "rgba(0, 0, 0, 0.6)";
    objectCtx.shadowOffsetX = 1; 
    objectCtx.shadowOffsetY = 2; 
    objectCtx.shadowBlur = 2;

    objectCtx.font = "bold " + 14 + "px Arial";
    objectCtx.fillStyle = difficultyButton.hovered ? "#ffffff" : "#b9b9f8";
    
    objectCtx.fillText(difficulty == 0 ? "EASY" : difficulty == 1 ? "HARD" : difficulty == 2 ? "EASY +" : "HARD +",112,122);

    objectCtx.restore();
}

function drawDifficultyHit(color: string) {
    hitCtx.globalAlpha = 1;
    hitCtx.beginPath();
    hitCtx.moveTo(81,72);
    
    for (let side = 0; side < 7; side++) {
        hitCtx.lineTo(142,72);
        hitCtx.lineTo(162,106);
        hitCtx.lineTo(142,141);
        hitCtx.lineTo(81,141);
        hitCtx.lineTo(60,106);
        hitCtx.lineTo(81,72);
    }
    
    hitCtx.fillStyle = color;
    hitCtx.fill();
}

function drawHelpHit(color: string) {
    hitCtx.globalAlpha = 1;
    hitCtx.beginPath();
    hitCtx.moveTo(81,688);
    
    for (let side = 0; side < 7; side++) {
        hitCtx.lineTo(750,688);
        hitCtx.lineTo(770,722);
        hitCtx.lineTo(750,757);
        hitCtx.lineTo(689,757);
        hitCtx.lineTo(668,722);
        hitCtx.lineTo(689,688);
    }
    
    hitCtx.fillStyle = color;
    hitCtx.fill();
}



function drawHex(x: number, y: number, type : number, opacity: number) {
    objectCtx.globalAlpha = opacity;
    objectCtx.drawImage(hexesImg,
        hexSpriteX(type), hexSpriteY(type),
        60, 67, 
        HexToCanvasX(x, y) - 30, HexToCanvasY(y) - 34,
        60, 67);
}

function drawHexSelection(x: number, y: number, opacity: number) {
    effectCtx.globalAlpha = opacity;
    effectCtx.drawImage(hexesImg,
        0, 134,
        96, 102, 
        HexToCanvasX(x, y) - 48, HexToCanvasY(y) - 51,
        96, 102);
}

function drawIndicatorHex(x: number, y: number, type: number, opacity: number) {
    objectCtx.globalAlpha = opacity;
    objectCtx.drawImage(hexesImg,
        hexSpriteX(type), hexSpriteY(type),
        60, 67, 
        x, y,
        43, 48);
}

function drawWins() {
    objectCtx.globalAlpha = 1;
    objectCtx.textAlign = "center";
    objectCtx.save();
    objectCtx.shadowColor = "rgba(0, 0, 0, 0.6)";
    objectCtx.shadowOffsetX = 1; 
    objectCtx.shadowOffsetY = 2; 
    objectCtx.shadowBlur = 2;

    objectCtx.font = "bold " + 18 + "px Arial";
    objectCtx.fillStyle = "#3fa8b3";
    objectCtx.fillText(wins[difficulty].toString(),720,124);

    objectCtx.restore();
}
/*function drawHex(type: number, x: number, y: number, opacity: number) {
    objectCtx.globalAlpha = opacity;
    objectCtx.drawImage(hexsImg, hexSpriteX(type), hexSpriteY(type),
     59, 59,
      HexToCanvasX(x, y), HexToCanvasY(y),
       59 *  , 59 *  );
}*/